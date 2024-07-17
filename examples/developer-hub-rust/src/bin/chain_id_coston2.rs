use alloy::providers::{Provider, ProviderBuilder};
use eyre::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let provider =
        ProviderBuilder::new().on_http("https://coston2-api.flare.network/ext/C/rpc".parse()?);
    let chain_id = provider.get_chain_id().await?;
    println!("Chain ID: {}", chain_id); // Chain ID: 114
    Ok(())
}
