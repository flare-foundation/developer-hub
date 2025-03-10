import os
import re
from pathlib import Path

import pandas as pd
import pandas_gbq
from google.cloud import bigquery
from google.oauth2 import service_account

PROJECT_ID = r"flare-network-sandbox"
CREDENTIALS_PATH = r"./env.json"


credentials = service_account.Credentials.from_service_account_file(CREDENTIALS_PATH)
client = bigquery.Client(credentials=credentials, project=PROJECT_ID)


def parse_markdown(content: str) -> list[tuple[str, str]]:
    """Extract metadata and content from markdown files."""
    pattern = re.compile(r"^---\n(.*?)\n---", re.DOTALL)
    metadata_match = pattern.search(content)

    if metadata_match:
        metadata_str = metadata_match.group(1).strip()
        content_extract = content.split("---", 2)[-1].strip()
        return [(metadata_str, content_extract)]

    return [("", content)]


def create_table(table_id: str) -> None:
    """Create a BigQuery table if it does not exist."""
    schema = [
        bigquery.SchemaField("file_name", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("meta_data", "STRING"),
        bigquery.SchemaField("content", "STRING"),
        bigquery.SchemaField("last_updated", "DATETIME"),
    ]
    table = bigquery.Table(table_id, schema=schema)
    try:
        client.create_table(table)
        print(f"Table {table_id} created successfully.")
    except Exception as e:
        print(f"Table creation error: {e}")


def check_table_exist(table_id: str) -> bool:
    """Check if a table exists in BigQuery."""
    try:
        if client.get_table(table_id):
            return True
    except Exception:
        return False


def load_data(data: pd.DataFrame, table_id: str) -> None:
    """Load data into BigQuery, ensuring last_updated is in DATETIME format."""
    print(f"Loading data into {table_id}")
    try:
        # Convert timestamp to datetime format for BigQuery compatibility
        data["last_updated"] = pd.to_datetime(data["last_updated"])
        pandas_gbq.to_gbq(
            data,
            table_id,
            project_id=PROJECT_ID,
            credentials=credentials,
            if_exists="append",
        )
        print(f"Successfully loaded {len(data)} rows into {table_id}")
    except Exception as e:
        print(f"Error loading data: {e}")


def process_markdown_files(directory: str, table_id: str) -> None:
    """Process markdown files from the given directory and load into BigQuery."""
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
            try:
                with file_path.open(encoding="utf-8") as md_file:
                    content = md_file.read()
                    parsed_content = parse_markdown(content)
                    for metadata, content in parsed_content:
                        file_content.append([file_path.name, metadata, content])
            except OSError as e:
                print(f"Error processing file {file_path}: {e}")

    if file_content:
        pd_data = pd.DataFrame(
            file_content, columns=["file_name", "meta_data", "content"]
        )
        pd_data["last_updated"] = pd.Timestamp.now().floor(
            "s"
        )  # Ensures precision matches DATETIME

        if not check_table_exist(table_id):
            create_table(table_id)

        load_data(pd_data, table_id)
    else:
        print("No markdown files found to process.")


if __name__ == "__main__":
    directory = "../docs"
    dataset_id = f"{PROJECT_ID}.flare_network_docs_data"
    table_id = f"{dataset_id}.docs_data001"
    process_markdown_files(directory, table_id)
