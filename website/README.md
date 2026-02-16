# WheelWise Website

Static presentation website for the Mini Data Analysis activity.

## Local Run

From project root:

```bash
# Regenerate dashboard payload and report artifacts
python scripts/generate_analysis.py

# Serve the website
python -m http.server 8000 --directory website
```

Open `http://localhost:8000`.

## Current Features

- Dotted U.S. map with top-state regional markers and concentration highlighting
- Summary cards for transactions, price validity, pricing health, and regional focus
- Data Dictionary carousel focused on analysis-used columns
- Data Preview table with full original headers
- Make/Year filters that drive both KPIs and Plotly charts
- Findings, recommendations, method notes, and data-quality anomaly notes

## Recent Changes

- Improved responsive sizing for the map and dictionary carousel/cards.
- Added data-quality anomaly notes section to the website appendix.
- Refined dictionary + preview split layout and state-name display normalization.
- Connected map marker intensity and recommendations to top-state concentration.
- Updated dashboard interactions so make/year filtering affects KPIs and charts together.

## Deploy (Vercel)

1. Push this project to GitHub.
2. In Vercel, choose **Add New Project** and import the repository.
3. Framework preset: **Other**.
4. Set **Root Directory** to `website`.
5. Deploy.

## Deploy (Netlify)

1. Push project to GitHub.
2. In Netlify, create site from Git.
3. Build command: *(leave empty)*
4. Publish directory: `website`
5. Deploy.
