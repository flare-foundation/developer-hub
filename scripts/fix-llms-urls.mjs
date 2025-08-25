#!/usr/bin/env node

/**
 * Script to fix URLs in generated LLMs files to match Docusaurus routing
 *
 * This script removes prepended numbers from URLs to match how Docusaurus
 * generates routes (e.g., "0-overview" becomes "overview")
 */

import fs from "fs";
import path from "path";

const config = {
  buildDir: "build",
  filesToFix: ["llms.txt", "llms-full.txt"],
  baseUrl: "https://dev.flare.network/",
};

function fixUrlsInFile(filePath) {
  try {
    console.log(`Fixing URLs in: ${filePath}`);

    const content = fs.readFileSync(filePath, "utf8");

    // Fix URLs by removing prepended numbers folder
    // Pattern: https://dev.flare.network/network/0-overview -> https://dev.flare.network/network/overview
    let fixedContent = content.replace(
      /(https:\/\/dev\.flare\.network\/[^)]+\/)\d+-([^)]+)/g,
      "$1$2",
    );

    fs.writeFileSync(filePath, fixedContent);

    console.log(`✅ Fixed URLs in: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing URLs in ${filePath}:`, error.message);
  }
}

function main() {
  console.log("🔧 Fixing URLs in LLMs files...");

  if (!fs.existsSync(config.buildDir)) {
    console.error(`❌ Build directory not found: ${config.buildDir}`);
    return;
  }

  config.filesToFix.forEach((fileName) => {
    const filePath = path.join(config.buildDir, fileName);

    if (fs.existsSync(filePath)) {
      fixUrlsInFile(filePath);
    } else {
      console.warn(`⚠️  File not found: ${filePath}`);
    }
  });

  console.log("✅ URL fixing completed!");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fixUrlsInFile, main };
