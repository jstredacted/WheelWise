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
        "top_makes": to_records(tx_by_make, 15),
        "top_bodies": to_records(tx_by_body, 12),
        "top_states": to_records(tx_by_state, 12),
        "transactions_by_year": to_records(tx_by_year),
        "transactions_by_month": to_records(tx_by_month[["year_month", "transactions"]]),
        "transactions_by_make_year": to_records(tx_by_make_year),
        "avg_price_by_make": to_records(avg_price_by_make, 15),
        "price_vs_mmr_by_make": to_records(price_vs_mmr_by_make, 15),
        "code_showcase": {
            "cleaning": "df['make'] = df['make'].str.upper()\\ncleaned = df['saledate'].str.replace(r' \\([A-Z]+\\)$', '', regex=True)\\ndf['sale_datetime'] = pd.to_datetime(cleaned, format='%a %b %d %Y %H:%M:%S GMT%z', utc=True, errors='coerce')",
            "category_summary": "tx_by_make = df.groupby('make').size().reset_index(name='transactions').sort_values('transactions', ascending=False)",
            "time_summary": "tx_by_month = df.groupby(['sale_year','sale_month']).size().reset_index(name='transactions')",
            "additional_summary": "price_vs_mmr_by_make = df.groupby('make')['price_vs_mmr'].mean().reset_index().sort_values('price_vs_mmr', ascending=False)",
        },
    }
    (WEBSITE_DATA_DIR / "dashboard_data.json").write_text(json.dumps(website_payload, indent=2))

    # Report draft (paper output)
    report_md = f"""# Mini Data Analysis & Reporting Activity

## 1. Title Page
- Activity Title: Mini Data Analysis & Reporting Activity
- Dataset: `car_prices.csv`
- Students: Justin Louis Amper Dampal and Greg Danielle Cabanda

## 2. Introduction
The dataset contains used-car sales transactions with fields for vehicle details, seller, condition, odometer reading, market reference value (MMR), final selling price, and sale date. It represents a dealership/auction sales context where each transaction captures a specific sale event.

The data likely originates from an operational automotive sales platform (e.g., dealer auction management or vehicle marketplace transaction system).

This report converts raw operational records into analytical summaries by category, time, and pricing behavior.

## 3. OLTP Perspective
One row represents one completed car sale transaction. It stores transactional attributes (what car was sold, by whom, when, and for how much).

This is OLTP data because records are event-level, high-volume, and designed for day-to-day operational recording rather than summarized reporting.

A typical system storing this data is a vehicle sales transaction management system integrated with dealer inventory and auction workflows.

## 4. Data Analysis (OLAP Results)
### 4.1 Transactions per Category (Make)
{markdown_table(tx_by_make, 10)}

### 4.2 Transactions per Time Period (Year)
{markdown_table(tx_by_year, 10)}

### 4.3 Transactions per Category (Body Type)
{markdown_table(tx_by_body, 10)}

### 4.4 Transactions per Category (State)
{markdown_table(tx_by_state, 10)}

### 4.5 Additional Aggregation: Average Selling Price by Make
{markdown_table(avg_price_by_make, 10)}

### 4.6 Additional Aggregation: Average Price vs MMR by Make
(Positive values indicate selling above MMR; negative values indicate below MMR.)

{markdown_table(price_vs_mmr_by_make, 10)}

## 5. Findings and Insights
- The dataset includes **{total_transactions:,}** transactions, indicating a large operational dataset suitable for trend analysis.
- The highest transaction volume is **{top_make['make']}** with **{int(top_make['transactions']):,}** transactions.
- The dominant body type is **{top_body['body']}** with **{int(top_body['transactions']):,}** transactions.
- The most active state is **{top_state['state']}** with **{int(top_state['transactions']):,}** transactions.
- The year with the highest number of transactions is **{int(yearly_peak['sale_year'])}** with **{int(yearly_peak['transactions']):,}** records.
- The peak month in the dataset is **{monthly_peak['year_month']}** with **{int(monthly_peak['transactions']):,}** transactions.
- Average selling price across valid records is **${avg_sellingprice:,.2f}**.
- On average, vehicles sold **${avg_price_vs_mmr:,.2f}** relative to MMR (negative means below MMR overall).

## 6. Recommendation
1. Prioritize inventory planning around high-volume makes and body types to match demand patterns.
2. Monitor pricing discipline for segments with consistently negative `price_vs_mmr` to reduce under-market sales.
3. Use monthly transaction peaks to plan auction participation, staffing, and promotional campaigns.
4. Track make-level performance monthly to detect which segments can sustain higher pricing above MMR.

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
    <li>Students: Justin Louis Amper Dampal and Greg Danielle Cabanda</li>
  </ul>

  <h2>2. Introduction</h2>
  <p>The dataset contains used-car sales transactions with fields for vehicle details, seller, condition, odometer reading, market reference value (MMR), final selling price, and sale date. It represents a dealership/auction sales context where each transaction captures a specific sale event.</p>
  <p>The data likely originates from an operational automotive sales platform (e.g., dealer auction management or vehicle marketplace transaction system).</p>
  <p>This report converts raw operational records into analytical summaries by category, time, and pricing behavior.</p>

  <h2>3. OLTP Perspective</h2>
  <p>One row represents one completed car sale transaction. It stores transactional attributes (what car was sold, by whom, when, and for how much).</p>
  <p>This is OLTP data because records are event-level, high-volume, and designed for day-to-day operational recording rather than summarized reporting.</p>
  <p>A typical system storing this data is a vehicle sales transaction management system integrated with dealer inventory and auction workflows.</p>

  <h2>4. Data Analysis (OLAP Results)</h2>
  <h3>4.1 Transactions per Category (Make)</h3>
  {html_table(tx_by_make, 10)}
  <h3>4.2 Transactions per Time Period (Year)</h3>
  {html_table(tx_by_year, 10)}
  <h3>4.3 Transactions per Category (Body Type)</h3>
  {html_table(tx_by_body, 10)}
  <h3>4.4 Transactions per Category (State)</h3>
  {html_table(tx_by_state, 10)}
  <h3>4.5 Additional Aggregation: Average Selling Price by Make</h3>
  {html_table(avg_price_by_make, 10)}
  <h3>4.6 Additional Aggregation: Average Price vs MMR by Make</h3>
  <p>(Positive values indicate selling above MMR; negative values indicate below MMR.)</p>
  {html_table(price_vs_mmr_by_make, 10)}

  <h2>5. Findings and Insights</h2>
  <ul>
    <li>The dataset includes <strong>{total_transactions:,}</strong> transactions, indicating a large operational dataset suitable for trend analysis.</li>
    <li>The highest transaction volume is <strong>{top_make['make']}</strong> with <strong>{int(top_make['transactions']):,}</strong> transactions.</li>
    <li>The dominant body type is <strong>{top_body['body']}</strong> with <strong>{int(top_body['transactions']):,}</strong> transactions.</li>
    <li>The most active state is <strong>{top_state['state']}</strong> with <strong>{int(top_state['transactions']):,}</strong> transactions.</li>
    <li>The year with the highest number of transactions is <strong>{int(yearly_peak['sale_year'])}</strong> with <strong>{int(yearly_peak['transactions']):,}</strong> records.</li>
    <li>The peak month in the dataset is <strong>{monthly_peak['year_month']}</strong> with <strong>{int(monthly_peak['transactions']):,}</strong> transactions.</li>
    <li>Average selling price across valid records is <strong>${avg_sellingprice:,.2f}</strong>.</li>
    <li>On average, vehicles sold <strong>${avg_price_vs_mmr:,.2f}</strong> relative to MMR (negative means below MMR overall).</li>
  </ul>

  <h2>6. Recommendation</h2>
  <ol>
    <li>Prioritize inventory planning around high-volume makes and body types to match demand patterns.</li>
    <li>Monitor pricing discipline for segments with consistently negative <code>price_vs_mmr</code> to reduce under-market sales.</li>
    <li>Use monthly transaction peaks to plan auction participation, staffing, and promotional campaigns.</li>
    <li>Track make-level performance monthly to detect which segments can sustain higher pricing above MMR.</li>
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
