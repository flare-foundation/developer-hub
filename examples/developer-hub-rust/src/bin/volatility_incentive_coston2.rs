// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
use alloy::{
    network::EthereumWallet, primitives::address, primitives::U256, providers::ProviderBuilder,
    signers::local::PrivateKeySigner, sol,
};
use eyre::Result;

// Declare this manually to avoid some strange nested type errors
sol! {
    #[sol(rpc)]
    interface FastUpdatesIncentiveManager {
        type SampleSize is uint256;
        type Range      is uint256;
        type Fee        is uint256;
        type Precision  is uint256;
        type Scale      is uint256;
        struct IncentiveOffer {
            Range rangeIncrease;
            Range rangeLimit;
        }
        constructor(
            address _governanceSettings,
            address _initialGovernance,
            address _addressUpdater,
            SampleSize _ss,
            Range      _r,
            SampleSize _sil,
            Range      _ril,
            Fee        _x,
            Fee        _rip,
            uint256    _dur
        );
        function getCurrentSampleSizeIncreasePrice()
            external view returns (Fee);
        function getExpectedSampleSize()
            external view returns (SampleSize);
        function getRange()
            external view returns (Range);
        function getScale()
            external view returns (Scale);
        function offerIncentive(IncentiveOffer calldata _offer)
            external payable;
    }
}
#[tokio::main]
async fn main() -> Result<()> {
    // Get private key from environment
    let private_key = std::env::var("ACCOUNT_PRIVATE_KEY")?;
    // FastUpdatesIncentiveManager address (Flare Testnet Coston2)
    // See https://dev.flare.network/ftso/solidity-reference
    let incentive_address = address!("d648e8ACA486Ce876D641A0F53ED1F2E9eF4885D");
    // Set up wallet and provider
    let signer: PrivateKeySigner = private_key.parse().unwrap();
    let wallet = EthereumWallet::from(signer.clone());
    let provider = ProviderBuilder::new()
        .wallet(wallet)
        .connect_http("https://coston2-api.flare.network/ext/C/rpc".parse()?);
    // Set up contract instance
    let incentive = FastUpdatesIncentiveManager::new(incentive_address, provider);

    // Get the current sample size, sample size increase price, range, and scale
    let sample_size_increase_price = incentive.getCurrentSampleSizeIncreasePrice().call().await?;
    let expected_sample_size = incentive.getExpectedSampleSize().call().await?;
    let range = incentive.getRange().call().await?;
    let scale = incentive.getScale().call().await?;
    println!("Sample Size Increase Price: {sample_size_increase_price:?}");
    println!("Current Sample Size: {expected_sample_size:?}");
    println!("Current Range: {range:?}");
    println!("Current Scale: {scale:?}");

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
    println!("Offer Incentive Tx Hash: {tx_hash:?}");

    // Get the new sample size increase price, sample size, range, and scale
    let sample_size_increase_price = incentive.getCurrentSampleSizeIncreasePrice().call().await?;
    let exp_sample_size = incentive.getExpectedSampleSize().call().await?;
    let range = incentive.getRange().call().await?;
    let scale = incentive.getScale().call().await?;
    println!("Sample Size Increase Price: {sample_size_increase_price:?} ");
    println!("Current Sample Size: {exp_sample_size:?}");
    println!("Current Range: {range:?}");
    println!("Current Scale: {scale:?}");
    Ok(())
}
