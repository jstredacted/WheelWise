# WheelWise - Car Prices Data Analysis

Mini Data Analysis & Reporting Activity for a used-car auction dataset (`car_prices.csv`, ~560K transactions).

**Students:** Justin Louis Amper Dampal & Greg Danielle Cabanda Duetes

## Project Structure

```
.
├── car_prices.csv                       # Raw dataset (16 columns, ~560K rows)
├── scripts/
│   └── generate_analysis.py             # Data cleaning, aggregation, report generation
├── outputs/
│   ├── analysis_summary.json            # Top-level KPIs
│   └── tables/                          # CSV summary tables (8 files)
├── report/
│   ├── Mini_Data_Analysis_Report.md     # Full Markdown report
│   └── Mini_Data_Analysis_Report.html   # HTML version (used for PDF generation)
├── website/
│   ├── index.html                       # Presentation website (6 sections)
│   ├── styles.css                       # Responsive styling with sticky nav
│   ├── app.js                           # Data dictionary rendering, charts, nav tracking
│   └── data/
│       └── dashboard_data.json          # Generated JSON consumed by website
└── Dampal_Duetes_MiniDataAnalysis.pdf   # Final PDF report (8 pages)
```

## Data Dictionary

The dataset contains 16 columns describing used-car auction transactions:

| Column | Type | Description |
|---|---|---|
| `year` | int | Model year of the vehicle |
| `make` | string | Manufacturer / brand |
| `model` | string | Specific model name |
| `trim` | string | Trim level or package variant |
| `body` | string | Body style (SEDAN, SUV, etc.) |
| `transmission` | string | Transmission type |
| `vin` | string | Vehicle Identification Number |
| `state` | string | U.S. state of sale (2-letter code) |
| `condition` | float | Condition rating (1.0-5.0 scale) |
| `odometer` | float | Mileage at time of sale |
| `color` | string | Exterior color |
| `interior` | string | Interior color |
| `seller` | string | Selling entity name |
| `mmr` | float | Manheim Market Report value |
| `sellingprice` | float | Actual transaction price |
| `saledate` | string | Full timestamp of the sale |

## Quick Start

**Requirements:** Python 3.10+, pandas, numpy

```bash
# Generate all reports, tables, and website data
python scripts/generate_analysis.py

# Preview the website locally
python -m http.server 8000 --directory website
# Open http://localhost:8000

# Regenerate the PDF (requires weasyprint + system libs)
DYLD_FALLBACK_LIBRARY_PATH="/opt/homebrew/lib" weasyprint \
  report/Mini_Data_Analysis_Report.html \
  Dampal_Duetes_MiniDataAnalysis.pdf
```

## Website Sections

The website is designed as a class presentation (replaces slides):

1. **Dataset Overview** - KPI cards showing row count, column count, top make/body
2. **Data Dictionary** - 16 interactive cards describing every column
3. **OLTP Perspective** - Why this is transactional data and its likely source system
4. **Methodology** - Code snippets with plain-English descriptions
5. **OLAP Dashboard** - Interactive Plotly charts with make/year filters (outlier values noted below charts)
6. **Findings & Recommendations** - Data-driven insights and actionable advice

## Report Sections

The generated report (MD/HTML/PDF) follows this structure:

1. Title Page
2. Introduction
3. Data Dictionary (16-column reference table)
4. OLTP Perspective
5. Data Analysis (OLAP Results) - 7 aggregation tables
6. Findings and Insights
7. Recommendations

## Deployment

See [`website/README.md`](website/README.md) for Vercel and Netlify deployment instructions.
