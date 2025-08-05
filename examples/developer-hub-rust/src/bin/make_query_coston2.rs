use alloy::{primitives::address, providers::ProviderBuilder, sol};
use eyre::Result;

sol!(
    #[sol(rpc)]
    FlareContractRegistry,
    "FlareContractRegistry.json"
);

#[tokio::main]
async fn main() -> Result<()> {
    let provider =
        ProviderBuilder::new().connect_http("https://coston2-api.flare.network/ext/C/rpc".parse()?);
    let registry = FlareContractRegistry::new(
        address!("aD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"),
        provider,
    );
    let address = registry
        .getContractAddressByName("WNat".to_string())
        .call()
        .await?;
    println!("WNat address: {address}"); // WNat address: 0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273
    Ok(())
}
