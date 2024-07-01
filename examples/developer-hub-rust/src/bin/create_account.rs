use alloy::signers::local::LocalSigner;
use eyre::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let signer = LocalSigner::random();
    println!(
        "Account: {}, Private key: {}",
        signer.address(),
        signer.as_nonzero_scalar()
    );
    Ok(())
}
