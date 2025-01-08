// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
#![allow(dead_code)]
#![allow(unused)]

use reqwest::Client;
use serde_json::json;

const BASE_URL: &str = "https://flr-data-availability.flare.network/";
const API_KEY: &str = "<your-api-key>";

const FEED_IDS: &[&str] = &[
    "0x01464c522f55534400000000000000000000000000", // FLR/USD
    "0x014254432f55534400000000000000000000000000", // BTC/USD
    "0x014554482f55534400000000000000000000000000", // ETH/USD
];

pub async fn fetch_anchor_feed(
    feed_ids: &[&str],
    voting_round_id: Option<u32>,
) -> Result<Vec<serde_json::Value>, reqwest::Error> {
    let client = Client::new();

    let mut url = format!("{BASE_URL}api/v0/ftso/anchor-feeds-with-proof");
    if let Some(id) = voting_round_id {
        url.push_str(&format!("?voting_round_id={}", id));
    }

    let response = client
        .post(&url)
        .header("X-API-KEY", API_KEY)
        .header("Content-Type", "application/json")
        .json(&json!({ "feed_ids": feed_ids }))
        .send()
        .await?;

    let json: Vec<serde_json::Value> = response.json().await?;
    Ok(json)
}

#[tokio::main]
async fn main() {
    match fetch_anchor_feed(FEED_IDS, None).await {
        Ok(data) => println!("Anchor feeds data: {:?}", data),
        Err(err) => eprintln!("Error fetching anchor feeds: {}", err),
    }
}
