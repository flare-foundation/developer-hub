function getFeedId(category, feedName) {
  const hexFeedName = Array.from(feedName)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
  const paddedHexString = (category + hexFeedName).padEnd(42, "0");
  return `0x${paddedHexString}`;
}

const feedId = getFeedId("01", "FLR/USD");
console.log(feedId);
