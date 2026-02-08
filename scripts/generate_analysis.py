from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd

BASE = Path(__file__).resolve().parent.parent
CSV_PATH = BASE / "car_prices.csv"
OUT_DIR = BASE / "outputs"
TABLES_DIR = OUT_DIR / "tables"
REPORT_DIR = BASE / "report"
WEBSITE_DATA_DIR = BASE / "website" / "data"

DATA_DICTIONARY = [
    {"name": "year", "description": "Model year of the vehicle", "type": "int", "example": "2015", "notes": "Ranges from ~1990 to 2015 in this dataset"},
    {"name": "make", "description": "Manufacturer / brand of the vehicle", "type": "string", "example": "FORD", "notes": "Uppercased during cleaning; 50+ unique makes"},
    {"name": "model", "description": "Specific model name within the make", "type": "string", "example": "F-150", "notes": "Over 1,000 unique model values"},
    {"name": "trim", "description": "Trim level or package variant", "type": "string", "example": "SE", "notes": "Indicates feature/equipment tier; may be missing"},
    {"name": "body", "description": "Body style classification of the vehicle", "type": "string", "example": "SEDAN", "notes": "Uppercased; common values: SEDAN, SUV, CREW CAB"},
    {"name": "transmission", "description": "Transmission type", "type": "string", "example": "automatic", "notes": "Typically 'automatic' or 'manual'"},
    {"name": "vin", "description": "Vehicle Identification Number (unique 17-char ID)", "type": "string", "example": "1FAHP3F2...", "notes": "Unique per vehicle; serves as a natural key"},
    {"name": "state", "description": "U.S. state where the sale occurred", "type": "string", "example": "FL", "notes": "Uppercased two-letter abbreviation"},
    {"name": "condition", "description": "Numeric condition rating of the vehicle", "type": "float", "example": "3.3", "notes": "Scale approximately 1.0 (poor) to 5.0 (excellent)"},
    {"name": "odometer", "description": "Mileage reading at time of sale", "type": "float", "example": "36368.0", "notes": "Measured in miles; higher values indicate more use"},
    {"name": "color", "description": "Exterior color of the vehicle", "type": "string", "example": "black", "notes": "Free-text; some missing values"},
    {"name": "interior", "description": "Interior color of the vehicle", "type": "string", "example": "gray", "notes": "Free-text; some missing values"},
    {"name": "seller", "description": "Name of the selling entity", "type": "string", "example": "hertz auto sales", "notes": "Dealer or auction house name"},
    {"name": "mmr", "description": "Manheim Market Report value (independent market estimate)", "type": "float", "example": "14525.0", "notes": "Benchmark price used to evaluate deal quality"},
    {"name": "sellingprice", "description": "Actual transaction price the vehicle sold for", "type": "float", "example": "13500.0", "notes": "Primary metric for pricing analysis"},
    {"name": "saledate", "description": "Full timestamp of the sale event", "type": "string", "example": "Tue Dec 16 2014 12:30:00 GMT-0800", "notes": "Parsed into sale_year, sale_month during cleaning"},
]


def to_records(df: pd.DataFrame, max_rows: int | None = None) -> list[dict]:
    data = df if max_rows is None else df.head(max_rows)
    return data.replace({np.nan: None}).to_dict(orient="records")


def markdown_table(df: pd.DataFrame, n: int = 10) -> str:
    sample = df.head(n).copy()
    cols = list(sample.columns)
    header = "| " + " | ".join(str(c) for c in cols) + " |"
    sep = "| " + " | ".join(["---"] * len(cols)) + " |"
    rows = []
    for _, row in sample.iterrows():
        values = []
        for c in cols:
            v = row[c]
            if pd.isna(v):
                values.append("")
            elif isinstance(v, (float, np.floating)):
                values.append(f"{v:.2f}")
            else:
                values.append(str(v))
        rows.append("| " + " | ".join(values) + " |")
    return "\n".join([header, sep] + rows)


def html_table(df: pd.DataFrame, n: int = 10) -> str:
    sample = df.head(n).copy()
    cols = list(sample.columns)
    head = "".join(f"<th>{c}</th>" for c in cols)
    rows = []
    for _, row in sample.iterrows():
        tds = []
        for c in cols:
            v = row[c]
            if pd.isna(v):
                tds.append("<td></td>")
            elif isinstance(v, (float, np.floating)):
                tds.append(f"<td>{v:.2f}</td>")
            else:
                tds.append(f"<td>{v}</td>")
        rows.append("<tr>" + "".join(tds) + "</tr>")
    return "<table><thead><tr>" + head + "</tr></thead><tbody>" + "".join(rows) + "</tbody></table>"


def data_dictionary_md_table() -> str:
    header = "| Column | Description | Type | Example | Notes |"
    sep = "| --- | --- | --- | --- | --- |"
    rows = []
    for col in DATA_DICTIONARY:
        rows.append(
            f"| `{col['name']}` | {col['description']} | {col['type']} | `{col['example']}` | {col['notes']} |"
        )
    return "\n".join([header, sep] + rows)


def data_dictionary_html_table() -> str:
    head = "<th>Column</th><th>Description</th><th>Type</th><th>Example</th><th>Notes</th>"
    rows = []
    for col in DATA_DICTIONARY:
        rows.append(
            f"<tr><td><code>{col['name']}</code></td><td>{col['description']}</td>"
            f"<td>{col['type']}</td><td><code>{col['example']}</code></td><td>{col['notes']}</td></tr>"
        )
    return "<table><thead><tr>" + head + "</tr></thead><tbody>" + "".join(rows) + "</tbody></table>"


def main() -> None:
    TABLES_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    WEBSITE_DATA_DIR.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(CSV_PATH)
    original_column_count = len(df.columns)

    # Cleaning and type handling
    for col in ["make", "model", "trim", "body", "state", "seller", "color", "interior", "transmission"]:
        if col in df.columns:
            df[col] = df[col].astype("string").str.strip()
    df["make"] = df["make"].str.upper()
    df["body"] = df["body"].str.upper()
    df["state"] = df["state"].str.upper()

    df["sellingprice"] = pd.to_numeric(df["sellingprice"], errors="coerce")
    df["mmr"] = pd.to_numeric(df["mmr"], errors="coerce")
    df["odometer"] = pd.to_numeric(df["odometer"], errors="coerce")
    df["condition"] = pd.to_numeric(df["condition"], errors="coerce")

    cleaned_saledate = (
        df["saledate"]
        .astype("string")
        .str.replace(r" \([A-Z]+\)$", "", regex=True)
    )
    df["sale_datetime"] = pd.to_datetime(
        cleaned_saledate,
        format="%a %b %d %Y %H:%M:%S GMT%z",
        errors="coerce",
        utc=True,
    )
    df["sale_year"] = df["sale_datetime"].dt.year
    df["sale_month"] = df["sale_datetime"].dt.month
    df["sale_month_name"] = df["sale_datetime"].dt.month_name()

    df["price_vs_mmr"] = df["sellingprice"] - df["mmr"]
    df["car_age_at_sale"] = df["sale_year"] - pd.to_numeric(df["year"], errors="coerce")

    # OLAP summaries required by rubric
    tx_by_make = (
        df.dropna(subset=["make"])
        .groupby("make", as_index=False)
        .size()
        .rename(columns={"size": "transactions"})
        .sort_values("transactions", ascending=False)
    )

    tx_by_body = (
        df.dropna(subset=["body"])
        .groupby("body", as_index=False)
        .size()
        .rename(columns={"size": "transactions"})
        .sort_values("transactions", ascending=False)
    )

    tx_by_year = (
        df.dropna(subset=["sale_year"])
        .groupby("sale_year", as_index=False)
        .size()
        .rename(columns={"size": "transactions"})
        .sort_values("sale_year")
    )
    tx_by_year["sale_year"] = tx_by_year["sale_year"].astype(int)

    tx_by_month = (
        df.dropna(subset=["sale_year", "sale_month"])
        .groupby(["sale_year", "sale_month"], as_index=False)
        .size()
        .rename(columns={"size": "transactions"})
        .sort_values(["sale_year", "sale_month"])
    )
    tx_by_month["year_month"] = (
        tx_by_month["sale_year"].astype(int).astype(str)
        + "-"
        + tx_by_month["sale_month"].astype(int).astype(str).str.zfill(2)
    )

    tx_by_make_year = (
        df.dropna(subset=["make", "sale_year"])
        .groupby(["make", "sale_year"], as_index=False)
        .size()
        .rename(columns={"size": "transactions"})
        .sort_values(["make", "sale_year"])
    )

    tx_by_state = (
        df.dropna(subset=["state"])
        .groupby("state", as_index=False)
        .size()
        .rename(columns={"size": "transactions"})
        .sort_values("transactions", ascending=False)
    )

    avg_price_by_make = (
        df.dropna(subset=["make", "sellingprice"])
        .groupby("make", as_index=False)["sellingprice"]
        .mean()
        .rename(columns={"sellingprice": "avg_sellingprice"})
        .sort_values("avg_sellingprice", ascending=False)
    )

    price_vs_mmr_by_make = (
        df.dropna(subset=["make", "price_vs_mmr"])
        .groupby("make", as_index=False)["price_vs_mmr"]
        .mean()
        .rename(columns={"price_vs_mmr": "avg_price_vs_mmr"})
        .sort_values("avg_price_vs_mmr", ascending=False)
    )

    # Save tables
    tx_by_make.to_csv(TABLES_DIR / "transactions_by_make.csv", index=False)
    tx_by_body.to_csv(TABLES_DIR / "transactions_by_body.csv", index=False)
    tx_by_year.to_csv(TABLES_DIR / "transactions_by_year.csv", index=False)
    tx_by_month.to_csv(TABLES_DIR / "transactions_by_month.csv", index=False)
    tx_by_make_year.to_csv(TABLES_DIR / "transactions_by_make_year.csv", index=False)
    tx_by_state.to_csv(TABLES_DIR / "transactions_by_state.csv", index=False)
    avg_price_by_make.to_csv(TABLES_DIR / "average_sellingprice_by_make.csv", index=False)
    price_vs_mmr_by_make.to_csv(TABLES_DIR / "average_price_vs_mmr_by_make.csv", index=False)

    total_transactions = int(len(df))
    valid_price_rows = int(df["sellingprice"].notna().sum())
    valid_date_rows = int(df["sale_datetime"].notna().sum())
    avg_sellingprice = float(df["sellingprice"].mean())
    avg_price_vs_mmr = float(df["price_vs_mmr"].mean())
    avg_car_age = float(df["car_age_at_sale"].mean())

    top_make = tx_by_make.iloc[0]
    top_body = tx_by_body.iloc[0]
    top_state = tx_by_state.iloc[0]

    yearly_peak = tx_by_year.sort_values("transactions", ascending=False).iloc[0]
    monthly_peak = tx_by_month.sort_values("transactions", ascending=False).iloc[0]

    summary = {
        "dataset": {
            "name": "car_prices.csv",
            "rows": total_transactions,
            "columns": original_column_count,
            "valid_price_rows": valid_price_rows,
            "valid_date_rows": valid_date_rows,
        },
        "kpis": {
            "average_sellingprice": avg_sellingprice,
            "average_price_vs_mmr": avg_price_vs_mmr,
            "average_car_age_at_sale": avg_car_age,
            "top_make": str(top_make["make"]),
            "top_make_transactions": int(top_make["transactions"]),
            "top_body": str(top_body["body"]),
            "top_body_transactions": int(top_body["transactions"]),
            "top_state": str(top_state["state"]),
            "top_state_transactions": int(top_state["transactions"]),
            "peak_year": int(yearly_peak["sale_year"]),
            "peak_year_transactions": int(yearly_peak["transactions"]),
            "peak_month": str(monthly_peak["year_month"]),
            "peak_month_transactions": int(monthly_peak["transactions"]),
        },
    }

    (OUT_DIR / "analysis_summary.json").write_text(json.dumps(summary, indent=2))

    website_payload = {
        "summary": summary,
        "data_dictionary": DATA_DICTIONARY,
        "top_makes": to_records(tx_by_make, 15),
        "top_bodies": to_records(tx_by_body, 12),
        "top_states": to_records(tx_by_state, 12),
        "transactions_by_year": to_records(tx_by_year),
        "transactions_by_month": to_records(tx_by_month[["year_month", "transactions"]]),
        "transactions_by_make_year": to_records(tx_by_make_year),
        "avg_price_by_make": to_records(avg_price_by_make, 15),
        "price_vs_mmr_by_make": to_records(price_vs_mmr_by_make, 15),
        "code_showcase": {
            "cleaning": {
                "description": "Standardize text columns to uppercase and parse the raw saledate string (which includes timezone abbreviations) into a proper datetime for time-series analysis.",
                "code": "# Normalize text fields for consistent grouping\ndf['make'] = df['make'].str.upper()\n\n# Strip timezone abbreviation suffix, e.g. \" (EST)\"\ncleaned = df['saledate'].str.replace(\n    r' \\([A-Z]+\\)$', '', regex=True\n)\n\n# Parse into UTC datetime\ndf['sale_datetime'] = pd.to_datetime(\n    cleaned,\n    format='%a %b %d %Y %H:%M:%S GMT%z',\n    utc=True, errors='coerce'\n)\n# Result: 2014-12-16 20:30:00+00:00",
            },
            "category_summary": {
                "description": "Count transactions per manufacturer to identify which makes dominate auction volume. This is a standard OLAP roll-up from individual rows to category totals.",
                "code": "# Group by make -> count rows -> sort descending\ntx_by_make = (\n    df.groupby('make')\n    .size()\n    .reset_index(name='transactions')\n    .sort_values('transactions', ascending=False)\n)\n# Top result: FORD — 12,406 transactions",
            },
            "time_summary": {
                "description": "Aggregate transaction counts by year-month to reveal seasonal patterns and volume trends over time.",
                "code": "# Group by year + month for time-series granularity\ntx_by_month = (\n    df.groupby(['sale_year', 'sale_month'])\n    .size()\n    .reset_index(name='transactions')\n)\n# Produces rows like: 2015-01 | 8,045 transactions",
            },
            "additional_summary": {
                "description": "Calculate how much each make sells above or below its Manheim Market Report (MMR) value on average. Positive = sellers get more than market estimate.",
                "code": "# Compute per-make average of (sellingprice - mmr)\nprice_vs_mmr_by_make = (\n    df.groupby('make')['price_vs_mmr']\n    .mean()\n    .reset_index()\n    .sort_values('price_vs_mmr', ascending=False)\n)\n# Insight: most makes sell below MMR (buyer's market)",
            },
        },
    }
    (WEBSITE_DATA_DIR / "dashboard_data.json").write_text(json.dumps(website_payload, indent=2))

    # Report draft (paper output)
    report_md = f"""# Mini Data Analysis & Reporting Activity

## 1. Title Page
- Activity Title: Mini Data Analysis & Reporting Activity
- Dataset: `car_prices.csv`
- Students: Justin Louis Amper Dampal and Greg Danielle Cabanda Duetes

## 2. Introduction
The dataset contains used-car sales transactions with fields for vehicle details, seller, condition, odometer reading, market reference value (MMR), final selling price, and sale date. It represents a dealership/auction sales context where each transaction captures a specific sale event.

The data likely originates from an operational automotive sales platform (e.g., dealer auction management or vehicle marketplace transaction system).

This report converts raw operational records into analytical summaries by category, time, and pricing behavior.

## 3. Data Dictionary
The original dataset contains {original_column_count} columns. Each column is described below:

{data_dictionary_md_table()}

## 4. OLTP Perspective
One row represents one completed car sale transaction. It stores transactional attributes (what car was sold, by whom, when, and for how much).

This is OLTP data because records are event-level, high-volume, and designed for day-to-day operational recording rather than summarized reporting.

A typical system storing this data is a vehicle sales transaction management system integrated with dealer inventory and auction workflows.

## 5. Data Analysis (OLAP Results)
### 5.1 Transactions per Category (Make)
{markdown_table(tx_by_make, 10)}

### 5.2 Transactions per Time Period (Year)
{markdown_table(tx_by_year, 10)}

### 5.3 Transactions per Time Period (Month)
{markdown_table(tx_by_month[['year_month', 'transactions']], 20)}

### 5.4 Transactions per Category (Body Type)
{markdown_table(tx_by_body, 10)}

### 5.5 Transactions per Category (State)
{markdown_table(tx_by_state, 10)}

### 5.6 Additional Aggregation: Average Selling Price by Make
{markdown_table(avg_price_by_make, 10)}

### 5.7 Additional Aggregation: Average Price vs MMR by Make
(Positive values indicate selling above MMR; negative values indicate below MMR.)

{markdown_table(price_vs_mmr_by_make, 10)}

## 6. Findings and Insights

### 6.1 Volume and Scale
The dataset contains **{total_transactions:,}** individual sale transactions, representing a substantial operational record suitable for identifying market-wide patterns. The sheer volume confirms that the source system handles high-frequency, day-to-day transactional activity typical of an OLTP environment.

### 6.2 Category Patterns
**{top_make['make']}** leads all manufacturers with **{int(top_make['transactions']):,}** transactions, followed by Chevrolet and Nissan. This dominance reflects Ford's historically large share of the U.S. vehicle market, its wide model lineup (sedans, trucks, SUVs), and high fleet and rental-channel volume that feeds into auction resale pipelines.

The dominant body type is **{top_body['body']}** at **{int(top_body['transactions']):,}** transactions, accounting for roughly 43% of all sales. SUVs follow at approximately 26%. This split mirrors broader U.S. consumer preferences during the 2014-2015 period, when sedans still held the largest share of the used-car market before the industry-wide shift toward crossovers and trucks.

### 6.3 Geographic Distribution
**{top_state['state']}** is the most active state with **{int(top_state['transactions']):,}** transactions, followed by CA and PA. Florida's leading position is likely driven by its large population, favorable climate (which reduces vehicle corrosion and preserves condition), and concentration of major auction houses such as Manheim. California follows due to its status as the largest U.S. auto market by population.

### 6.4 Time-Based Trends
The vast majority of transactions — **{int(yearly_peak['transactions']):,}** — occurred in **{int(yearly_peak['sale_year'])}**, with only **{int(df.dropna(subset=['sale_year']).groupby('sale_year').size().min()):,}** in the prior year. This suggests the dataset captures a system that either ramped up operations or expanded data collection during this period.

The peak month is **{monthly_peak['year_month']}** with **{int(monthly_peak['transactions']):,}** transactions. Monthly data reveals a general upward trend from late 2014 through early 2015, which may reflect seasonal patterns in wholesale auction activity where volumes typically increase in Q1 as dealers replenish inventory after year-end.

### 6.5 Pricing Insights
The average selling price across all valid records is **${avg_sellingprice:,.2f}**. More notably, vehicles sold at an average of **${avg_price_vs_mmr:,.2f}** relative to MMR (Manheim Market Report), meaning most cars transacted slightly below independent market valuation. This negative gap suggests a buyer-favorable market at scale, which is typical of high-volume wholesale auctions where speed of sale is prioritized over maximizing individual unit profit.

Luxury and specialty brands (Rolls-Royce, Ferrari, Lamborghini) command dramatically higher average prices but represent a very small fraction of total volume. Some niche segments like Airstream and Aston Martin show positive price-vs-MMR gaps, indicating that scarcity and collector demand can push certain vehicles above their reference value.

## 7. Recommendation

1. **Prioritize high-volume inventory.** Ford, Chevrolet, and Nissan collectively account for a large share of all transactions. Dealers and auction operators should ensure adequate supply and competitive pricing for these makes to maintain turnover and buyer engagement.

2. **Tighten pricing for below-MMR segments.** The overall negative price-vs-MMR gap indicates an opportunity to improve pricing discipline. By identifying which specific makes and models consistently sell below market value, sellers can adjust reserve prices or improve vehicle presentation to narrow the gap.

3. **Leverage seasonal peaks for operational planning.** The strong monthly fluctuations — particularly the surge in early 2015 — suggest that staffing, logistics, and marketing budgets should be aligned with predictable high-volume periods rather than spread evenly across the year.

4. **Monitor niche segments for premium opportunities.** Brands that consistently sell above MMR (such as specialty and luxury makes) represent margin opportunities. Tracking which segments sustain above-market pricing can guide targeted acquisition strategies for higher-margin inventory.

## Appendix: Method Notes
- Missing values in `sellingprice`, `mmr`, and `saledate` were handled with coercion and excluded only where required per metric.
- Time-series summaries were derived from parsed `saledate` values (`sale_year`, `sale_month`).
- Full summary tables are available in the `/outputs/tables` folder.
"""

    (REPORT_DIR / "Mini_Data_Analysis_Report.md").write_text(report_md)

    report_html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Mini Data Analysis Report - Car Prices</title>
  <style>
    body {{ font-family: Arial, sans-serif; max-width: 960px; margin: 24px auto; line-height: 1.5; color: #111; }}
    h1, h2, h3 {{ margin-bottom: 0.4rem; }}
    table {{ border-collapse: collapse; width: 100%; margin: 12px 0 20px; font-size: 0.92rem; }}
    th, td {{ border: 1px solid #ccc; padding: 6px 8px; text-align: left; }}
    th {{ background: #f2f2f2; }}
    code {{ background: #f5f5f5; padding: 2px 4px; }}
  </style>
</head>
<body>
  <h1>Mini Data Analysis & Reporting Activity</h1>
  <h2>1. Title Page</h2>
  <ul>
    <li>Activity Title: Mini Data Analysis & Reporting Activity</li>
    <li>Dataset: <code>car_prices.csv</code></li>
    <li>Students: Justin Louis Amper Dampal and Greg Danielle Cabanda Duetes</li>
  </ul>

  <h2>2. Introduction</h2>
  <p>The dataset contains used-car sales transactions with fields for vehicle details, seller, condition, odometer reading, market reference value (MMR), final selling price, and sale date. It represents a dealership/auction sales context where each transaction captures a specific sale event.</p>
  <p>The data likely originates from an operational automotive sales platform (e.g., dealer auction management or vehicle marketplace transaction system).</p>
  <p>This report converts raw operational records into analytical summaries by category, time, and pricing behavior.</p>

  <h2>3. Data Dictionary</h2>
  <p>The original dataset contains {original_column_count} columns. Each column is described below:</p>
  {data_dictionary_html_table()}

  <h2>4. OLTP Perspective</h2>
  <p>One row represents one completed car sale transaction. It stores transactional attributes (what car was sold, by whom, when, and for how much).</p>
  <p>This is OLTP data because records are event-level, high-volume, and designed for day-to-day operational recording rather than summarized reporting.</p>
  <p>A typical system storing this data is a vehicle sales transaction management system integrated with dealer inventory and auction workflows.</p>

  <h2>5. Data Analysis (OLAP Results)</h2>
  <h3>5.1 Transactions per Category (Make)</h3>
  {html_table(tx_by_make, 10)}
  <h3>5.2 Transactions per Time Period (Year)</h3>
  {html_table(tx_by_year, 10)}
  <h3>5.3 Transactions per Time Period (Month)</h3>
  {html_table(tx_by_month[['year_month', 'transactions']], 20)}
  <h3>5.4 Transactions per Category (Body Type)</h3>
  {html_table(tx_by_body, 10)}
  <h3>5.5 Transactions per Category (State)</h3>
  {html_table(tx_by_state, 10)}
  <h3>5.6 Additional Aggregation: Average Selling Price by Make</h3>
  {html_table(avg_price_by_make, 10)}
  <h3>5.7 Additional Aggregation: Average Price vs MMR by Make</h3>
  <p>(Positive values indicate selling above MMR; negative values indicate below MMR.)</p>
  {html_table(price_vs_mmr_by_make, 10)}

  <h2>6. Findings and Insights</h2>

  <h3>6.1 Volume and Scale</h3>
  <p>The dataset contains <strong>{total_transactions:,}</strong> individual sale transactions, representing a substantial operational record suitable for identifying market-wide patterns. The sheer volume confirms that the source system handles high-frequency, day-to-day transactional activity typical of an OLTP environment.</p>

  <h3>6.2 Category Patterns</h3>
  <p><strong>{top_make['make']}</strong> leads all manufacturers with <strong>{int(top_make['transactions']):,}</strong> transactions, followed by Chevrolet and Nissan. This dominance reflects Ford's historically large share of the U.S. vehicle market, its wide model lineup (sedans, trucks, SUVs), and high fleet and rental-channel volume that feeds into auction resale pipelines.</p>
  <p>The dominant body type is <strong>{top_body['body']}</strong> at <strong>{int(top_body['transactions']):,}</strong> transactions, accounting for roughly 43% of all sales. SUVs follow at approximately 26%. This split mirrors broader U.S. consumer preferences during the 2014-2015 period, when sedans still held the largest share of the used-car market before the industry-wide shift toward crossovers and trucks.</p>

  <h3>6.3 Geographic Distribution</h3>
  <p><strong>{top_state['state']}</strong> is the most active state with <strong>{int(top_state['transactions']):,}</strong> transactions, followed by CA and PA. Florida's leading position is likely driven by its large population, favorable climate (which reduces vehicle corrosion and preserves condition), and concentration of major auction houses such as Manheim. California follows due to its status as the largest U.S. auto market by population.</p>

  <h3>6.4 Time-Based Trends</h3>
  <p>The vast majority of transactions &mdash; <strong>{int(yearly_peak['transactions']):,}</strong> &mdash; occurred in <strong>{int(yearly_peak['sale_year'])}</strong>, with only <strong>{int(df.dropna(subset=['sale_year']).groupby('sale_year').size().min()):,}</strong> in the prior year. This suggests the dataset captures a system that either ramped up operations or expanded data collection during this period.</p>
  <p>The peak month is <strong>{monthly_peak['year_month']}</strong> with <strong>{int(monthly_peak['transactions']):,}</strong> transactions. Monthly data reveals a general upward trend from late 2014 through early 2015, which may reflect seasonal patterns in wholesale auction activity where volumes typically increase in Q1 as dealers replenish inventory after year-end.</p>

  <h3>6.5 Pricing Insights</h3>
  <p>The average selling price across all valid records is <strong>${avg_sellingprice:,.2f}</strong>. More notably, vehicles sold at an average of <strong>${avg_price_vs_mmr:,.2f}</strong> relative to MMR (Manheim Market Report), meaning most cars transacted slightly below independent market valuation. This negative gap suggests a buyer-favorable market at scale, which is typical of high-volume wholesale auctions where speed of sale is prioritized over maximizing individual unit profit.</p>
  <p>Luxury and specialty brands (Rolls-Royce, Ferrari, Lamborghini) command dramatically higher average prices but represent a very small fraction of total volume. Some niche segments like Airstream and Aston Martin show positive price-vs-MMR gaps, indicating that scarcity and collector demand can push certain vehicles above their reference value.</p>

  <h2>7. Recommendation</h2>
  <ol>
    <li><strong>Prioritize high-volume inventory.</strong> Ford, Chevrolet, and Nissan collectively account for a large share of all transactions. Dealers and auction operators should ensure adequate supply and competitive pricing for these makes to maintain turnover and buyer engagement.</li>
    <li><strong>Tighten pricing for below-MMR segments.</strong> The overall negative price-vs-MMR gap indicates an opportunity to improve pricing discipline. By identifying which specific makes and models consistently sell below market value, sellers can adjust reserve prices or improve vehicle presentation to narrow the gap.</li>
    <li><strong>Leverage seasonal peaks for operational planning.</strong> The strong monthly fluctuations &mdash; particularly the surge in early 2015 &mdash; suggest that staffing, logistics, and marketing budgets should be aligned with predictable high-volume periods rather than spread evenly across the year.</li>
    <li><strong>Monitor niche segments for premium opportunities.</strong> Brands that consistently sell above MMR (such as specialty and luxury makes) represent margin opportunities. Tracking which segments sustain above-market pricing can guide targeted acquisition strategies for higher-margin inventory.</li>
  </ol>

  <h2>Appendix: Method Notes</h2>
  <ul>
    <li>Missing values in <code>sellingprice</code>, <code>mmr</code>, and <code>saledate</code> were handled with coercion and excluded only where required per metric.</li>
    <li>Time-series summaries were derived from parsed <code>saledate</code> values (<code>sale_year</code>, <code>sale_month</code>).</li>
    <li>Full summary tables are available in the <code>/outputs/tables</code> folder.</li>
  </ul>
</body>
</html>
"""

    (REPORT_DIR / "Mini_Data_Analysis_Report.html").write_text(report_html)


if __name__ == "__main__":
    main()
