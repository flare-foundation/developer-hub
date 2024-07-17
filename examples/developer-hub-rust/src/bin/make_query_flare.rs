use alloy::{providers::ProviderBuilder, sol};
use eyre::Result;

sol!(
    #[sol(rpc)]
    FlareContractRegistry,
    "FlareContractRegistry.json"
);

#[tokio::main]
async fn main() -> Result<()> {
    let provider =
        ProviderBuilder::new().on_http("https://flare-api.flare.network/ext/C/rpc".parse()?);
    let registry = FlareContractRegistry::new(
        "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019".parse()?,
        provider,
    );
    let FlareContractRegistry::getContractAddressByNameReturn { _0 } = registry
        .getContractAddressByName("WNat".to_string())
        .call()
        .await?;
    println!("WNat address: {_0}"); // WNat address: 0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d
    Ok(())
}
