# WheelWise - Car Prices Data Analysis

Mini Data Analysis & Reporting Activity for a used-car auction dataset (`car_prices.csv`, ~560K transactions).

**Students:** Justin Louis Amper Dampal & Greg Danielle Cabanda Duetes

## Current Version

Latest local version includes:
- year-aware OLAP aggregations
- make/year-filtered dashboard KPIs and charts
- dotted U.S. state-concentration map with region markers
- data-quality anomaly notes in report + website
- responsive map and dictionary carousel/card sizing improvements

## Project Structure

```text
.
├── car_prices.csv                         # Raw dataset (16 columns, ~560K rows)
├── scripts/
│   └── generate_analysis.py               # Cleaning, OLAP summaries, report/website payload generation
├── outputs/
│   ├── analysis_summary.json              # Summary KPIs + data-quality metrics
│   └── tables/                            # 13 generated CSV summary tables
├── report/
│   ├── Mini_Data_Analysis_Report.md       # Generated Markdown report
│   └── Mini_Data_Analysis_Report.html     # Generated HTML report
├── website/
│   ├── index.html                         # Presentation website
│   ├── styles.css                         # Responsive layout/styles
│   ├── app.js                             # Rendering logic, filters, charts, map, carousel
│   ├── data/
│   │   ├── dashboard_data.json            # Generated dashboard payload
│   │   ├── dotted_map_data.json           # Map point source
│   │   └── car_prices_preview.csv         # Preview table source
│   └── README.md                          # Website run/deploy guide
└── Dampal_Duetes_MiniDataAnalysis.pdf     # Exported PDF report
```

## Generated Tables

`scripts/generate_analysis.py` currently outputs 13 OLAP tables under `outputs/tables/`:
- `transactions_by_make.csv`
- `transactions_by_body.csv`
- `transactions_by_state.csv`
- `transactions_by_year.csv`
- `transactions_by_month.csv`
- `transactions_by_make_year.csv`
- `transactions_by_make_month.csv`
- `average_sellingprice_by_make.csv`
- `average_sellingprice_by_year.csv`
- `average_sellingprice_by_make_year.csv`
- `average_price_vs_mmr_by_make.csv`
- `average_price_vs_mmr_by_year.csv`
- `average_price_vs_mmr_by_make_year.csv`

## Website Flow

The website is organized as:
1. Live board with dotted U.S. map and top-state concentration
2. Summary cards (transactions, pricing health, market leaders, regional focus)
3. Introduction + dataset KPI panel
4. Data Dictionary carousel (analysis-focused columns) + data preview table
5. Analysis dashboard (make/year filters + Plotly charts + filtered KPIs)
6. Findings and Insights
7. Recommendations
8. Method Notes, Data Quality Notes, and Code Showcase

## Quick Start

**Requirements:** Python 3.10+, pandas, numpy

```bash
# Generate outputs, report files, and website payload
python scripts/generate_analysis.py

# Run website locally
python -m http.server 8000 --directory website
# Open http://localhost:8000
```

Optional PDF regeneration (requires `weasyprint` and local system libraries):

```bash
DYLD_FALLBACK_LIBRARY_PATH="/opt/homebrew/lib" weasyprint \
  report/Mini_Data_Analysis_Report.html \
  Dampal_Duetes_MiniDataAnalysis.pdf
```

## What Changed So Far

Recent implementation milestones (latest first):
- `25fd59d` - Fixed responsive map and dictionary carousel sizing behavior.
- `0ebec7e` - Added data-quality anomaly notes to generated report and website method section.
- `86203c6` - Linked dotted map intensity/recommendations to state concentration.
- `442debf` - Refined dictionary + preview layout and expanded state-name rendering.
- `408be4e` - Reworked website into report-aligned chapter flow.
- `cc1a5a1` - Made dashboard charts and KPIs honor make/year filters.
- `dda041e` - Added year-aware aggregate tables and dynamic code showcase examples.
- `5704dbe` - Introduced data dictionary experience and presentation-first website structure.

## Deployment

Deployment instructions are in [`/Users/justin/Repositories/Personal/WheelWise/website/README.md`](website/README.md).
