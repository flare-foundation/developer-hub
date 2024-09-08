fn get_feed_id(category: &str, feed_name: &str) -> String {
    let hex_feed_name = feed_name
        .as_bytes()
        .iter()
        .map(|byte| format!("{:02x}", byte))
        .collect::<Vec<String>>()
        .join("");
    let combined = format!("{}{}", category, hex_feed_name);
    let padded_hex_string = format!("{:0<42}", combined);
    format!("0x{}", padded_hex_string)
}

fn main() {
    let feed_id = get_feed_id("01", "FLR/USD");
    println!("{}", feed_id);
}
