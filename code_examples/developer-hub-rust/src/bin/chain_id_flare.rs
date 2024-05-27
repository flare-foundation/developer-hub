use ethers::providers::{Middleware, Provider};
use eyre::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let provider = Provider::try_from("https://rpc.ankr.com/flare")?;
    let chain_id = provider.get_chainid().await?;
    println!("Chain ID: {}", chain_id); // Chain ID: 14
    Ok(())
}
