// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {IAssetManager} from "flare-periphery/src/flare/IAssetManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ILayerZeroComposer} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroComposer.sol";
import {OFTComposeMsgCodec} from "@layerzerolabs/oft-evm/contracts/libs/OFTComposeMsgCodec.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ReentrancyGuardTransient} from "@openzeppelin/contracts/utils/ReentrancyGuardTransient.sol";
import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";
import {IIFAssetRedeemerAccount} from "../interface/IIFAssetRedeemerAccount.sol";
import {FAssetRedeemerAccountProxy} from "../proxy/FAssetRedeemerAccountProxy.sol";
import {IFAssetRedeemComposer} from "../../userInterfaces/IFAssetRedeemComposer.sol";
import {IBeacon} from "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";
import {OwnableWithTimelock} from "../../utils/implementation/OwnableWithTimelock.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title FAssetRedeemComposer
 * @notice LayerZero compose handler that orchestrates deterministic redeemer accounts and f-asset redemption.
 */
contract FAssetRedeemComposer is
    IFAssetRedeemComposer,
    OwnableWithTimelock,
    UUPSUpgradeable,
    ReentrancyGuardTransient
{
    using SafeERC20 for IERC20;

    uint256 private constant PPM_DENOMINATOR = 1_000_000;

    /// @notice Mapping of redeemer to deterministic redeemer account address.
    mapping(address redeemer => address redeemerAccount)
        private redeemerToRedeemerAccount;

    /// @notice Trusted endpoint allowed to invoke `lzCompose`.
    address public endpoint;
    /// @notice Asset manager used for f-asset redemption.
    IAssetManager public assetManager;
    /// @notice FAsset token.
    IERC20 public fAsset;
    /// @notice Stable coin token - returned in case of a redemption failure.
    IERC20 public stableCoin;
    /// @notice Wrapped native token - returned in case of a redemption failure if stable coin balance is insufficient.
    IERC20 public wNat;
    /// @notice Trusted source OApp address (FAssetOFTAdapter).
    address public trustedSourceOApp;
    /// @notice Current beacon implementation for redeemer account proxies.
    address public redeemerAccountImplementation;
    /// @notice Recipient of composer fee collected in fAsset.
    address public composerFeeRecipient;
    /// @notice Default composer fee in PPM.
    uint256 public defaultComposerFeePPM;
    /// @notice Optional srcEid-specific composer fee in PPM, stored as fee + 1 to distinguish unset values.
    mapping(uint32 srcEid => uint256 feePPM) private composerFeesPPM;
    /// @notice The redeem executor.
    address payable private executor;
    /// @notice The native fee expected by the executor for redeem execution.
    uint256 private executorFee;

    /**
     * @notice Disables initializers on implementation contract.
     */
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initializes composer proxy state.
     * @param _initialOwner Owner address for administrative operations.
     * @param _endpoint Trusted endpoint allowed to invoke `lzCompose`.
     * @param _trustedSourceOApp Trusted source OApp address.
     * @param _assetManager Asset manager used for redemption.
     * @param _stableCoin Stable coin token - returned in case of a redemption failure.
     * @param _wNat Wrapped native token - returned in case of a redemption failure
     *              if stable coin balance is insufficient.
     * @param _composerFeeRecipient Recipient of composer fee collected in fAsset.
     * @param _defaultComposerFeePPM Default composer fee in PPM.
     * @param _redeemerAccountImplementation Beacon implementation for redeemer accounts.
     */
    function initialize(
        address _initialOwner,
        address _endpoint,
        address _trustedSourceOApp,
        IAssetManager _assetManager,
        IERC20 _stableCoin,
        IERC20 _wNat,
        address _composerFeeRecipient,
        uint256 _defaultComposerFeePPM,
        address _redeemerAccountImplementation
    ) external initializer {
        require(_initialOwner != address(0), InvalidAddress());
        require(_endpoint != address(0), InvalidAddress());
        require(_trustedSourceOApp != address(0), InvalidAddress());
        require(address(_assetManager).code.length > 0, InvalidAddress());
        require(address(_stableCoin).code.length > 0, InvalidAddress());
        require(address(_wNat).code.length > 0, InvalidAddress());
        require(_composerFeeRecipient != address(0), InvalidAddress());
        require(
            _defaultComposerFeePPM < PPM_DENOMINATOR,
            InvalidComposerFeePPM()
        );
        require(
            _redeemerAccountImplementation.code.length > 0,
            InvalidRedeemerAccountImplementation()
        );

        __Ownable_init(_initialOwner);

        endpoint = _endpoint;
        trustedSourceOApp = _trustedSourceOApp;
        assetManager = _assetManager;
        fAsset = _assetManager.fAsset();
        require(address(fAsset).code.length > 0, InvalidAddress());
        stableCoin = _stableCoin;
        wNat = _wNat;
        composerFeeRecipient = _composerFeeRecipient;
        defaultComposerFeePPM = _defaultComposerFeePPM;
        redeemerAccountImplementation = _redeemerAccountImplementation;

        emit ComposerFeeRecipientSet(_composerFeeRecipient);
        emit DefaultComposerFeeSet(_defaultComposerFeePPM);
        emit RedeemerAccountImplementationSet(redeemerAccountImplementation);
    }

    /**
     * @notice Updates default composer fee in PPM.
     * @param _defaultComposerFeePPM New default composer fee in PPM.
     */
    function setDefaultComposerFee(
        uint256 _defaultComposerFeePPM
    ) external onlyOwnerWithTimelock {
        require(
            _defaultComposerFeePPM < PPM_DENOMINATOR,
            InvalidComposerFeePPM()
        );
        defaultComposerFeePPM = _defaultComposerFeePPM;
        emit DefaultComposerFeeSet(_defaultComposerFeePPM);
    }

    /**
     * @notice Sets srcEid-specific composer fees in PPM.
     * @dev Uses fee+1 storage to distinguish unset (0) from an explicit zero fee.
     * @param _srcEids List of OFT source endpoint IDs.
     * @param _composerFeesPPM Composer fee values in PPM for corresponding srcEids.
     */
    function setComposerFees(
        uint32[] calldata _srcEids,
        uint256[] calldata _composerFeesPPM
    ) external onlyOwnerWithTimelock {
        require(_srcEids.length == _composerFeesPPM.length, LengthMismatch());

        for (uint256 i = 0; i < _srcEids.length; i++) {
            uint32 srcEid = _srcEids[i];
            uint256 feePPM = _composerFeesPPM[i];
            require(feePPM < PPM_DENOMINATOR, InvalidComposerFeePPM());
            composerFeesPPM[srcEid] = feePPM + 1;
            emit ComposerFeeSet(srcEid, feePPM);
        }
    }

    /**
     * @notice Removes srcEid-specific composer fee overrides.
     * @param _srcEids List of OFT source endpoint IDs.
     */
    function removeComposerFees(
        uint32[] calldata _srcEids
    ) external onlyOwnerWithTimelock {
        for (uint256 i = 0; i < _srcEids.length; i++) {
            uint32 srcEid = _srcEids[i];
            require(composerFeesPPM[srcEid] != 0, ComposerFeeNotSet(srcEid));
            delete composerFeesPPM[srcEid];
            emit ComposerFeeRemoved(srcEid);
        }
    }

    /**
     * @notice Updates recipient for collected composer fee.
     * @param _composerFeeRecipient New recipient address.
     */
    function setComposerFeeRecipient(
        address _composerFeeRecipient
    ) external onlyOwnerWithTimelock {
        require(
            _composerFeeRecipient != address(0),
            InvalidComposerFeeRecipient()
        );
        composerFeeRecipient = _composerFeeRecipient;
        emit ComposerFeeRecipientSet(_composerFeeRecipient);
    }

    /**
     * @notice Updates beacon implementation used by redeemer accounts.
     * @param _implementation New implementation address.
     */
    function setRedeemerAccountImplementation(
        address _implementation
    ) external onlyOwnerWithTimelock {
        require(
            _implementation.code.length > 0,
            InvalidRedeemerAccountImplementation()
        );
        redeemerAccountImplementation = _implementation;
        emit RedeemerAccountImplementationSet(_implementation);
    }

    /**
     * @notice Updates executor data used for redemption execution.
     * @param _executor New executor address.
     * @param _executorFee New expected fee for executor.
     */
    function setExecutorData(
        address payable _executor,
        uint256 _executorFee
    ) external onlyOwnerWithTimelock {
        require(
            _executor != address(0) || _executorFee == 0,
            InvalidExecutorData()
        );
        executor = _executor;
        executorFee = _executorFee;
        emit ExecutorDataSet(_executor, _executorFee);
    }

    /**
     * @notice Transfers f-assets held by composer to a target address.
     * @dev Recovery function for funds stuck on composer when compose flow fails or is not invoked.
     * @param _to Recipient address.
     * @param _amount Amount of f-asset to transfer.
     */
    function transferFAsset(
        address _to,
        uint256 _amount
    ) external onlyOwnerWithTimelock {
        require(_to != address(0), InvalidAddress());
        fAsset.safeTransfer(_to, _amount);
        emit FAssetTransferred(_to, _amount);
    }

    /**
     * @notice Transfers native tokens held by composer to a target address.
     * @dev Recovery function for funds stuck on composer when compose flow fails.
     * @param _to Recipient address.
     * @param _amount Amount of native tokens to transfer.
     */
    function transferNative(
        address _to,
        uint256 _amount
    ) external onlyOwnerWithTimelock {
        require(_to != address(0), InvalidAddress());
        (bool success, ) = _to.call{value: _amount}("");
        require(success, NativeTransferFailed());
        emit NativeTransferred(_to, _amount);
    }

    /// @inheritdoc ILayerZeroComposer
    function lzCompose(
        address _from,
        bytes32 _guid,
        bytes calldata _message,
        address /* _executor */,
        bytes calldata /* _extraData */
    ) external payable nonReentrant {
        require(msg.sender == endpoint, OnlyEndpoint());
        require(_from == trustedSourceOApp, InvalidSourceOApp(_from));

        uint32 srcEid = OFTComposeMsgCodec.srcEid(_message);
        uint256 amountLD = OFTComposeMsgCodec.amountLD(_message);
        uint256 composerFeePPM = _getComposerFeePPM(srcEid);
        uint256 composerFee = Math.mulDiv(
            amountLD,
            composerFeePPM,
            PPM_DENOMINATOR
        );
        uint256 amountToRedeemAfterFee = amountLD - composerFee;
        RedeemComposeData memory data = abi.decode(
            OFTComposeMsgCodec.composeMsg(_message),
            (RedeemComposeData)
        );
        require(data.redeemer != address(0), InvalidAddress());

        if (composerFee > 0) {
            fAsset.safeTransfer(composerFeeRecipient, composerFee);
            emit ComposerFeeCollected(
                _guid,
                srcEid,
                composerFeeRecipient,
                composerFee
            );
        }

        address redeemerAccount = _getOrCreateRedeemerAccount(data.redeemer);
        fAsset.safeTransfer(redeemerAccount, amountToRedeemAfterFee);
        emit FAssetTransferred(redeemerAccount, amountToRedeemAfterFee);

        try
            IIFAssetRedeemerAccount(redeemerAccount).redeemFAsset{
                value: msg.value
            }(
                assetManager,
                amountToRedeemAfterFee,
                data.redeemerUnderlyingAddress,
                executor,
                executorFee
            )
        returns (uint256 _redeemedAmountUBA) {
            emit FAssetRedeemed(
                _guid,
                srcEid,
                data.redeemer,
                redeemerAccount,
                amountToRedeemAfterFee,
                data.redeemerUnderlyingAddress,
                executor,
                executorFee,
                _redeemedAmountUBA
            );
        } catch {
            emit FAssetRedeemFailed(
                _guid,
                srcEid,
                data.redeemer,
                redeemerAccount,
                amountToRedeemAfterFee
            );
        }
    }

    /// @inheritdoc IFAssetRedeemComposer
    function getComposerFeePPM(
        uint32 _srcEid
    ) external view returns (uint256 _composerFeePPM) {
        _composerFeePPM = _getComposerFeePPM(_srcEid);
    }

    /// @inheritdoc IBeacon
    function implementation() external view returns (address) {
        return redeemerAccountImplementation;
    }

    /// @inheritdoc IFAssetRedeemComposer
    function getExecutorData()
        external
        view
        returns (address payable _executor, uint256 _executorFee)
    {
        _executor = executor;
        _executorFee = executorFee;
    }

    /// @inheritdoc IFAssetRedeemComposer
    function getRedeemerAccountAddress(
        address _redeemer
    ) external view returns (address _redeemerAccount) {
        _redeemerAccount = redeemerToRedeemerAccount[_redeemer];
        if (_redeemerAccount == address(0)) {
            bytes memory bytecode = _generateRedeemerAccountBytecode(_redeemer);
            _redeemerAccount = Create2.computeAddress(
                bytes32(0),
                keccak256(bytecode)
            );
        }
    }

    /**
     * @inheritdoc UUPSUpgradeable
     * @dev Only owner can call this method.
     */
    function upgradeToAndCall(
        address _newImplementation,
        bytes memory _data
    ) public payable override onlyOwnerWithTimelock {
        super.upgradeToAndCall(_newImplementation, _data);
    }

    /**
     * Unused. Present just to satisfy UUPSUpgradeable requirement as call is timelocked.
     * The real check is in onlyOwnerWithTimelock modifier on upgradeToAndCall.
     */
    function _authorizeUpgrade(address _newImplementation) internal override {}

    /**
     * @notice Gets existing redeemer account or creates a deterministic one.
     * @param _redeemer Redeemer account owner address.
     * @return _redeemerAccount Redeemer account address.
     */
    function _getOrCreateRedeemerAccount(
        address _redeemer
    ) internal returns (address _redeemerAccount) {
        _redeemerAccount = redeemerToRedeemerAccount[_redeemer];
        if (_redeemerAccount != address(0)) {
            return _redeemerAccount;
        }

        // redeemer account does not exist, create it
        bytes memory bytecode = _generateRedeemerAccountBytecode(_redeemer);
        _redeemerAccount = Create2.deploy(0, bytes32(0), bytecode); // reverts on failure
        redeemerToRedeemerAccount[_redeemer] = _redeemerAccount;
        emit RedeemerAccountCreated(_redeemer, _redeemerAccount);

        // set unlimited allowances for fAsset, stable coin and wNat
        // to enable redeemer to transfer funds to redeemer address in case of redemption failure
        IIFAssetRedeemerAccount(_redeemerAccount).setMaxAllowances(
            fAsset,
            stableCoin,
            wNat
        );
    }

    /**
     * @notice Builds CREATE2 deployment bytecode for redeemer account proxy.
     * @param _redeemer Redeemer account owner address.
     * @return Bytecode used for deterministic deployment.
     */
    function _generateRedeemerAccountBytecode(
        address _redeemer
    ) internal view returns (bytes memory) {
        return
            abi.encodePacked(
                type(FAssetRedeemerAccountProxy).creationCode,
                abi.encode(address(this), _redeemer)
            );
    }

    /**
     * @notice Retrieves composer fee in PPM for a given srcEid, falling back to default if not set.
     * @param _srcEid OFT source endpoint ID.
     * @return _composerFeePPM Composer fee in PPM.
     */
    function _getComposerFeePPM(
        uint32 _srcEid
    ) internal view returns (uint256 _composerFeePPM) {
        uint256 srcEidFeePlusOne = composerFeesPPM[_srcEid];
        if (srcEidFeePlusOne > 0) {
            return srcEidFeePlusOne - 1;
        }

        return defaultComposerFeePPM;
    }
}
