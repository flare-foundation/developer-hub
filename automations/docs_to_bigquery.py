import os
import re
from pathlib import Path
import pandas as pd

MARKDOWN_EXTENSION = [".md", ".mdx"]


def parse_markdown(content: str) -> list[tuple[str, str]]:
    pattern = re.compile(r"^---\n(.*?)\n---\n(.*)", re.DOTALL)
    match = pattern.match(content)
    return (
        [(match.group(1).strip(), match.group(2).strip())]
        if match
        else [("", content.strip())]
    )


def process_markdown_files(directory: Path, output_csv: Path) -> None:
    if not directory.exists():
        print(f"Directory not found: {directory}")
        return

    file_content: list[list[str]] = []
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() not in MARKDOWN_EXTENSION:
                continue

            print(f"Processing file: {file_path}")
            try:
                content = file_path.read_text(encoding="utf-8")
                parsed_content = parse_markdown(content)

                for metadata_, content in parsed_content:
                    file_content.append([file_path.name, metadata_, content])

            except OSError as e:
                print(f"Error processing file {file_path}: {e}")
    pd_data = pd.DataFrame(file_content, columns=["Filename", "Metadata", "Contents"]) # pyright: ignore [reportArgumentType]
    pd_data.to_csv(output_csv, index=False)


if __name__ == "__main__":
    # Define the directory containing .md/.mdx files and the output CSV file
    directory = Path("..", "docs")
    output_csv = Path("docs.csv")

    # Process the files
    process_markdown_files(directory, output_csv)
    print(f"CSV file created at: {output_csv}")
