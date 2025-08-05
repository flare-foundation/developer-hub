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
        ProviderBuilder::new().connect_http("https://flare-api.flare.network/ext/C/rpc".parse()?);
    let registry = FlareContractRegistry::new(
        address!("aD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"),
        provider,
    );
    let address = registry
        .getContractAddressByName("WNat".to_string())
        .call()
        .await?;
    println!("WNat address: {address}"); // WNat address: 0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d
    Ok(())
}
