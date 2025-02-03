import os
import re
from pathlib import Path

import pandas as pd


def parse_markdown(content: str) -> list[tuple[str, str]]:
    parsed_content = []
    pattern = re.compile(r"^---\n(.*?)\n---", re.DOTALL)
    metadata_match = pattern.search(content)

    if metadata_match:
        metadata_str = metadata_match.group(1).strip()
        content_extract = content.split("---", 2)[-1].strip()
        parsed_content.append((metadata_str, content_extract))
        return parsed_content

    parsed_content.append(("", content))
    return parsed_content


def process_markdown_files(directory: str, output_csv: str) -> None:
    directory_path = Path(directory)
    if not directory_path.exists():
        print(f"Directory not found: {directory}")
        return

    file_content = []
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() not in [".md", ".mdx"]:
                continue

            print(f"Processing file: {file_path}")
            try:
                with Path.open(file_path, encoding="utf-8") as md_file:
                    content = md_file.read()
                    parsed_content = parse_markdown(content)

                    for metadata_, content in parsed_content:
                        file_content.append([file_path.name, metadata_, content])

            except OSError as e:
                print(f"Error processing file {file_path}: {e}")
    pd_data = pd.DataFrame(file_content, columns=["Filename", "Metadata", "Contents"])
    pd_data.to_csv(output_csv, index=False)


if __name__ == "__main__":
    # Define the directory containing .md/.mdx files and the output CSV file
    directory = r"../docs"
    output_csv = "docs.csv"

    # Process the files
    process_markdown_files(directory, output_csv)
    print(f"CSV file created at: {output_csv}")
