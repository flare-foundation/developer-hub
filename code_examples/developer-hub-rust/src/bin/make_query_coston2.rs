use std::sync::Arc;

use ethers::{prelude::abigen, providers::Provider, types::Address};
use eyre::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let registry_addr: Address = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019".parse()?;
    let provider = Provider::try_from("https://rpc.ankr.com/flare_coston2")?;
    let client = Arc::new(provider);

    abigen!(FlareContractRegistry, "./FlareContractRegistry.json");
    let registry = FlareContractRegistry::new(registry_addr, client);

    if let Ok(wnat_addr) = registry
        .get_contract_address_by_name("WNat".to_string())
        .call()
        .await
    {
        println!("WNat address: {wnat_addr:?}");
        // WNat address: 0xc67dce33d7a8efa5ffeb961899c73fe01bce9273
    }
    Ok(())
}
