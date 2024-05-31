use alloy::{
    network::EthereumSigner, providers::ProviderBuilder, signers::wallet::LocalWallet, sol,
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

    let signer: LocalWallet = private_key.parse().unwrap();
    let provider = ProviderBuilder::new()
        .with_recommended_fillers()
        .signer(EthereumSigner::from(signer))
        .on_http("https://rpc.ankr.com/flare".parse()?);

    let contract = FtsoV2FeedConsumer::deploy(&provider).await?;
    println!("Deployed contract at address: {}", contract.address());
    Ok(())
}
