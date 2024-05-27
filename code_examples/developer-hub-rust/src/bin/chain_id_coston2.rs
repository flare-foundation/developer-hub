use ethers::providers::{Middleware, Provider};
use eyre::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let provider = Provider::try_from("https://rpc.ankr.com/flare_coston2")?;
    let chain_id = provider.get_chainid().await?;
    println!("Chain ID: {}", chain_id); // Chain ID: 114
    Ok(())
}
