// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
use crate::FtsoV2AnchorFeedConsumer::{FeedData, FeedDataWithProof};
use alloy::{
    network::EthereumWallet,
    primitives::{address, hex, FixedBytes},
    providers::{Provider, ProviderBuilder},
    signers::local::PrivateKeySigner,
    sol,
};
use hex::FromHex;
use serde_json::Value;

// Import the fetch_anchor_feeds module
mod fetch_anchor_feeds;

// ABI bindings for the Solidity contract
sol!(
    #[sol(rpc)]
    FtsoV2AnchorFeedConsumer,
    "FtsoV2AnchorFeedConsumer.json"
);

const BTC_USD_FEED_ID: &str = "0x014254432f55534400000000000000000000000000";
const TARGET_VOTING_ROUND: u32 = 823402;

mod convert_type {
    use super::*;

    // Functions for type conversion
    pub fn as_u16(value: &Value) -> Result<u16, Box<dyn std::error::Error>> {
        value
            .as_u64()
            .and_then(|v| v.try_into().ok())
            .ok_or("Invalid u16 value".into())
    }

    pub fn as_u32(value: &Value) -> Result<u32, Box<dyn std::error::Error>> {
        value
            .as_u64()
            .and_then(|v| v.try_into().ok())
            .ok_or("Invalid u32 value".into())
    }

    pub fn as_i8(value: &Value) -> Result<i8, Box<dyn std::error::Error>> {
        value
            .as_i64()
            .and_then(|v| v.try_into().ok())
            .ok_or("Invalid i8 value".into())
    }

    pub fn as_i32(value: &Value) -> Result<i32, Box<dyn std::error::Error>> {
        value
            .as_i64()
            .and_then(|v| v.try_into().ok())
            .ok_or("Invalid i32 value".into())
    }

    // Function to convert JSON proofs to FixedBytes
    pub fn json_proofs_to_fixed_bytes(
        proofs: &[Value],
    ) -> Result<Vec<FixedBytes<32>>, Box<dyn std::error::Error>> {
        let mut result = Vec::new();

        for proof in proofs {
            let proof_str = proof.as_str().ok_or("Proof value is not a string")?;

            // Validate and convert hex string
            let fixed_bytes = hex_to_fixed_bytes_32(proof_str)?;
            result.push(fixed_bytes);
        }

        Ok(result)
    }

    // Function to convert hex string to FixedBytes<32>
    pub fn hex_to_fixed_bytes_32(
        hex_str: &str,
    ) -> Result<FixedBytes<32>, Box<dyn std::error::Error>> {
        // Handle both 0x-prefixed and unprefixed hex strings
        let clean_hex = if hex_str.starts_with("0x") || hex_str.starts_with("0X") {
            &hex_str[2..]
        } else {
            hex_str
        };

        // Validate length (64 characters = 32 bytes)
        if clean_hex.len() != 64 {
            return Err(format!(
                "Hex string must be 64 characters (32 bytes), got {} characters",
                clean_hex.len()
            )
            .into());
        }

        // Convert hex to bytes using the hex crate
        let mut bytes = [0u8; 32];
        hex::decode_to_slice(clean_hex, &mut bytes)
            .map_err(|e| format!("Hex decoding failed: {}", e))?;

        Ok(FixedBytes::<32>::from(bytes))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let feed_data: Vec<Value> =
        fetch_anchor_feeds::fetch_anchor_feed(&[BTC_USD_FEED_ID], Some(TARGET_VOTING_ROUND))
            .await?;

    let raw_proofs = feed_data[0]["proof"]
        .as_array()
        .ok_or("Missing or invalid proof array")?;
    let raw_body = feed_data[0]["body"]
        .as_object()
        .ok_or("Missing or invalid body object")?;

    let byte_proof = convert_type::json_proofs_to_fixed_bytes(raw_proofs)?;

    let body_data = FeedData {
        decimals: convert_type::as_i8(&raw_body["decimals"])?,
        id: FixedBytes::<21>::from_slice(&hex::decode(
            raw_body["id"].as_str().ok_or("Invalid id format")?,
        )?),
        turnoutBIPS: convert_type::as_u16(&raw_body["turnoutBIPS"])?,
        value: convert_type::as_i32(&raw_body["value"])?,
        votingRoundId: convert_type::as_u32(&raw_body["votingRoundId"])?,
    };

    let contract_address = address!("069227C6A947d852c55655e41C6a382868627920");
    let private_key = " your_private_key_here";

    let signer: PrivateKeySigner = private_key.parse()?;
    let wallet = EthereumWallet::from(signer.clone());

    let provider = ProviderBuilder::new()
        .with_recommended_fillers()
        .wallet(wallet)
        .on_http("https://coston2-api.flare.network/ext/C/rpc".parse()?);

    let latest_block = provider.get_block_number().await?;
    println!("Latest block number: {latest_block}");

    let contract = FtsoV2AnchorFeedConsumer::new(contract_address, provider);

    let feed_data_with_proof = FeedDataWithProof {
        proof: byte_proof,
        body: body_data,
    };

    let tx_hash = contract
        .savePrice(feed_data_with_proof)
        .send()
        .await?
        .watch()
        .await?;

    println!("Save Price transaction hash: {}", tx_hash);

    let feed_id: FixedBytes<21> = {
        let hex_str = BTC_USD_FEED_ID
            .strip_prefix("0x")
            .unwrap_or(BTC_USD_FEED_ID);
        let bytes: [u8; 21] = <[u8; 21]>::from_hex(hex_str)?;
        FixedBytes::new(bytes)
    };
    let saved_price = contract
        .provenFeeds(TARGET_VOTING_ROUND, feed_id)
        .call()
        .await?;
    println!("Saved Price is {}", saved_price.value);

    Ok(())
}
