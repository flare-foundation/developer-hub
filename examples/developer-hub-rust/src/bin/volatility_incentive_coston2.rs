// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
use alloy::{
    network::EthereumWallet, primitives::U256, providers::ProviderBuilder,
    signers::local::PrivateKeySigner, sol,
};
use eyre::Result;

sol!(
    #[sol(rpc)]
    FastUpdatesIncentiveManager,
    r#"[{"type":"constructor","stateMutability":"nonpayable","inputs":[{"type":"address","name":"_governanceSettings","internalType":"contract IGovernanceSettings"},{"type":"address","name":"_initialGovernance","internalType":"address"},{"type":"address","name":"_addressUpdater","internalType":"address"},{"type":"uint256","name":"_ss","internalType":"SampleSize"},{"type":"uint256","name":"_r","internalType":"Range"},{"type":"uint256","name":"_sil","internalType":"SampleSize"},{"type":"uint256","name":"_ril","internalType":"Range"},{"type":"uint256","name":"_x","internalType":"Fee"},{"type":"uint256","name":"_rip","internalType":"Fee"},{"type":"uint256","name":"_dur","internalType":"uint256"}]},{"type":"event","name":"DailyAuthorizedInflationSet","inputs":[{"type":"uint256","name":"authorizedAmountWei","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"GovernanceCallTimelocked","inputs":[{"type":"bytes4","name":"selector","internalType":"bytes4","indexed":false},{"type":"uint256","name":"allowedAfterTimestamp","internalType":"uint256","indexed":false},{"type":"bytes","name":"encodedCall","internalType":"bytes","indexed":false}],"anonymous":false},{"type":"event","name":"GovernanceInitialised","inputs":[{"type":"address","name":"initialGovernance","internalType":"address","indexed":false}],"anonymous":false},{"type":"event","name":"GovernedProductionModeEntered","inputs":[{"type":"address","name":"governanceSettings","internalType":"address","indexed":false}],"anonymous":false},{"type":"event","name":"IncentiveOffered","inputs":[{"type":"uint24","name":"rewardEpochId","internalType":"uint24","indexed":true},{"type":"uint256","name":"rangeIncrease","internalType":"Range","indexed":false},{"type":"uint256","name":"sampleSizeIncrease","internalType":"SampleSize","indexed":false},{"type":"uint256","name":"offerAmount","internalType":"Fee","indexed":false}],"anonymous":false},{"type":"event","name":"InflationReceived","inputs":[{"type":"uint256","name":"amountReceivedWei","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"InflationRewardsOffered","inputs":[{"type":"uint24","name":"rewardEpochId","internalType":"uint24","indexed":true},{"type":"tuple[]","name":"feedConfigurations","internalType":"struct IFastUpdatesConfiguration.FeedConfiguration[]","indexed":false,"components":[{"type":"bytes21","name":"feedId","internalType":"bytes21"},{"type":"uint32","name":"rewardBandValue","internalType":"uint32"},{"type":"uint24","name":"inflationShare","internalType":"uint24"}]},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"TimelockedGovernanceCallCanceled","inputs":[{"type":"bytes4","name":"selector","internalType":"bytes4","indexed":false},{"type":"uint256","name":"timestamp","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"TimelockedGovernanceCallExecuted","inputs":[{"type":"bytes4","name":"selector","internalType":"bytes4","indexed":false},{"type":"uint256","name":"timestamp","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"advance","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"cancelGovernanceCall","inputs":[{"type":"bytes4","name":"_selector","internalType":"bytes4"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"dailyAuthorizedInflation","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"executeGovernanceCall","inputs":[{"type":"bytes4","name":"_selector","internalType":"bytes4"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"fastUpdater","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IFastUpdatesConfiguration"}],"name":"fastUpdatesConfiguration","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IIFlareSystemsManager"}],"name":"flareSystemsManager","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"_addressUpdater","internalType":"address"}],"name":"getAddressUpdater","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"Scale"}],"name":"getBaseScale","inputs":[]},{"type":"function","stateMutability":"pure","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"getContractName","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"Fee"}],"name":"getCurrentSampleSizeIncreasePrice","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getExpectedBalance","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"SampleSize"}],"name":"getExpectedSampleSize","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getIncentiveDuration","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"getInflationAddress","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"Precision"}],"name":"getPrecision","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"Range"}],"name":"getRange","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"Scale"}],"name":"getScale","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"_lockedFundsWei","internalType":"uint256"},{"type":"uint256","name":"_totalInflationAuthorizedWei","internalType":"uint256"},{"type":"uint256","name":"_totalClaimedWei","internalType":"uint256"}],"name":"getTokenPoolSupplyData","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"governance","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IGovernanceSettings"}],"name":"governanceSettings","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"initialise","inputs":[{"type":"address","name":"_governanceSettings","internalType":"contract IGovernanceSettings"},{"type":"address","name":"_initialGovernance","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"isExecutor","inputs":[{"type":"address","name":"_address","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"lastInflationAuthorizationReceivedTs","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"lastInflationReceivedTs","inputs":[]},{"type":"function","stateMutability":"payable","outputs":[],"name":"offerIncentive","inputs":[{"type":"tuple","name":"_offer","internalType":"struct IFastUpdateIncentiveManager.IncentiveOffer","components":[{"type":"uint256","name":"rangeIncrease","internalType":"Range"},{"type":"uint256","name":"rangeLimit","internalType":"Range"}]}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"productionMode","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"Range"}],"name":"rangeIncreaseLimit","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"Fee"}],"name":"rangeIncreasePrice","inputs":[]},{"type":"function","stateMutability":"payable","outputs":[],"name":"receiveInflation","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IIRewardManager"}],"name":"rewardManager","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"SampleSize"}],"name":"sampleIncreaseLimit","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setDailyAuthorizedInflation","inputs":[{"type":"uint256","name":"_toAuthorizeWei","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setIncentiveParameters","inputs":[{"type":"uint256","name":"_ss","internalType":"SampleSize"},{"type":"uint256","name":"_r","internalType":"Range"},{"type":"uint256","name":"_x","internalType":"Fee"},{"type":"uint256","name":"_dur","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setRangeIncreaseLimit","inputs":[{"type":"uint256","name":"_lim","internalType":"Range"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setRangeIncreasePrice","inputs":[{"type":"uint256","name":"_price","internalType":"Fee"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setSampleIncreaseLimit","inputs":[{"type":"uint256","name":"_lim","internalType":"SampleSize"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"switchToProductionMode","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"allowedAfterTimestamp","internalType":"uint256"},{"type":"bytes","name":"encodedCall","internalType":"bytes"}],"name":"timelockedCalls","inputs":[{"type":"bytes4","name":"selector","internalType":"bytes4"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalInflationAuthorizedWei","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalInflationReceivedWei","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalInflationRewardsOfferedWei","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"triggerRewardEpochSwitchover","inputs":[{"type":"uint24","name":"_currentRewardEpochId","internalType":"uint24"},{"type":"uint64","name":"_currentRewardEpochExpectedEndTs","internalType":"uint64"},{"type":"uint64","name":"_rewardEpochDurationSeconds","internalType":"uint64"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"updateContractAddresses","inputs":[{"type":"bytes32[]","name":"_contractNameHashes","internalType":"bytes32[]"},{"type":"address[]","name":"_contractAddresses","internalType":"address[]"}]}]"#
);

#[tokio::main]
async fn main() -> Result<()> {
    // Get private key from environment
    let private_key = std::env::var("ACCOUNT_PRIVATE_KEY")?;
    // FastUpdatesIncentiveManager address (Flare Testnet Coston2)
    // See https://dev.flare.network/ftso/solidity-reference
    let incentive_address = "0x003e9bD18f73e0B25BED0DC8382Bde6aa999525c".parse()?;
    // Set up wallet and provider
    let signer: PrivateKeySigner = private_key.parse().unwrap();
    let wallet = EthereumWallet::from(signer.clone());
    let provider = ProviderBuilder::new()
        .with_recommended_fillers()
        .wallet(wallet)
        .on_http("https://coston2-api.flare.network/ext/C/rpc".parse()?);
    // Set up contract instance
    let incentive = FastUpdatesIncentiveManager::new(incentive_address, provider);

    // Get the current sample size, sample size increase price, range, and scale
    let FastUpdatesIncentiveManager::getCurrentSampleSizeIncreasePriceReturn {
        _0: sample_size_increase_price,
    } = incentive.getCurrentSampleSizeIncreasePrice().call().await?;
    let FastUpdatesIncentiveManager::getExpectedSampleSizeReturn {
        _0: expected_sample_size,
    } = incentive.getExpectedSampleSize().call().await?;
    let FastUpdatesIncentiveManager::getRangeReturn { _0: range } =
        incentive.getRange().call().await?;
    let FastUpdatesIncentiveManager::getScaleReturn { _0: scale } =
        incentive.getScale().call().await?;
    println!(
        "Sample Size Increase Price: {:?} ",
        sample_size_increase_price
    );
    println!("Current Sample Size: {:?} ", expected_sample_size);
    println!("Current Range: {:?} ", range);
    println!("Current Scale: {:?} ", scale);

    // Offer the incentive
    let offer = FastUpdatesIncentiveManager::IncentiveOffer {
        rangeIncrease: U256::from(0),
        rangeLimit: U256::from(0),
    };
    let tx_hash = incentive
        .offerIncentive(offer)
        .value(sample_size_increase_price)
        .send()
        .await?
        .watch()
        .await?;
    println!("Offer Incentive Tx Hash: {:?}", tx_hash);

    // Get the new sample size increase price, sample size, range, and scale
    let FastUpdatesIncentiveManager::getCurrentSampleSizeIncreasePriceReturn {
        _0: sample_size_increase_price,
    } = incentive.getCurrentSampleSizeIncreasePrice().call().await?;
    let FastUpdatesIncentiveManager::getExpectedSampleSizeReturn {
        _0: exp_sample_size,
    } = incentive.getExpectedSampleSize().call().await?;
    let FastUpdatesIncentiveManager::getRangeReturn { _0: range } =
        incentive.getRange().call().await?;
    let FastUpdatesIncentiveManager::getScaleReturn { _0: scale } =
        incentive.getScale().call().await?;
    println!(
        "Sample Size Increase Price: {:?} ",
        sample_size_increase_price
    );
    println!("Current Sample Size: {:?} ", exp_sample_size);
    println!("Current Range: {:?} ", range);
    println!("Current Scale: {:?} ", scale);
    Ok(())
}
