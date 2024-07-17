// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
use alloy::{
    network::EthereumWallet, providers::ProviderBuilder, signers::local::PrivateKeySigner, sol,
};
use eyre::Result;

sol!(
    #[sol(rpc)]
    FtsoV2FeedConsumer,
    "./FtsoV2FeedConsumer.json"
);

#[tokio::main]
async fn main() -> Result<()> {
    let private_key = std::env::var("ACCOUNT_PRIVATE_KEY")?;

    let signer: PrivateKeySigner = private_key.parse().unwrap();
    let wallet = EthereumWallet::from(signer.clone());
    let provider = ProviderBuilder::new()
        .with_recommended_fillers()
        .wallet(wallet)
        .on_http("https://coston2-api.flare.network/ext/C/rpc".parse()?);

    let contract = FtsoV2FeedConsumer::deploy(&provider).await?;
    println!("Deployed contract at address: {}", contract.address());
    Ok(())
}
