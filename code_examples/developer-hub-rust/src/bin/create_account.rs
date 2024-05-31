use alloy::signers::{wallet::LocalWallet, Signer};
use eyre::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let signer = LocalWallet::random();
    println!(
        "Account: {}, Private key: {}",
        signer.address(),
        signer.as_nonzero_scalar()
    );
    Ok(())
}
