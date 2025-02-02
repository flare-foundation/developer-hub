# BigQuery Markdown Parser

A Python script that converts markdown files (`.md` and `.mdx`) into a CSV format for BigQuery ingestion, extracting metadata and content.

## What it does

- Walks through a specified directory to find markdown files
- Parses frontmatter metadata and content
- Outputs to CSV format compatible with BigQuery import
- Creates three columns: Filename, Metadata, Contents

## Usage

```bash
pip install -r requirements.txt
python app.py
```
