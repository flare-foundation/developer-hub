// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
use alloy::{primitives::address, providers::ProviderBuilder, sol};
use eyre::Result;

sol!(
    #[sol(rpc)]
    RandomNumberV2,
    "RandomNumberV2.json"
);

#[tokio::main]
async fn main() -> Result<()> {
    // Relay address where the secure RNG is served (Flare Testnet Coston2)
    // See https://dev.flare.network/network/solidity-reference
    let random_v2_address = address!("97702e350CaEda540935d92aAf213307e9069784");
    let rpc_url = "https://coston2-api.flare.network/ext/C/rpc".parse()?;
    // Connect to an RPC node
    let provider = ProviderBuilder::new().connect_http(rpc_url);
    // Set up contract instance
    let random_v2 = RandomNumberV2::new(random_v2_address, provider);
    // Fetch secure random number
    let RandomNumberV2::getRandomNumberReturn {
        _randomNumber,
        _isSecureRandom,
        _randomTimestamp,
    } = random_v2.getRandomNumber().call().await?;
    // Print results
    println!("Random Number: {_randomNumber:?}");
    println!("Is secure random: {_isSecureRandom:?}");
    println!("Timestamp: {_randomTimestamp:?}");
    Ok(())
}
