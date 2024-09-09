def get_feed_id(category: str, feed_name: str) -> str:
    hex_feed_name = feed_name.encode("utf-8").hex()
    padded_hex_string = (category + hex_feed_name).ljust(42, "0")
    return f"0x{padded_hex_string}"


feed_id = get_feed_id("01", "FLR/USD")
print(feed_id)
