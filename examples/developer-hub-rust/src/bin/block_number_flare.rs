use alloy::providers::{Provider, ProviderBuilder};
use eyre::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let provider =
        ProviderBuilder::new().on_http("https://flare-api.flare.network/ext/C/rpc".parse()?);
    println!("{}", provider.get_block_number().await?);
    Ok(())
}
