# Car Prices Dashboard Demo

This is a static website for the Mini Data Analysis activity.

## Local run

From project root:

```bash
python scripts/generate_analysis.py
python -m http.server 8000 --directory website
```

Open `http://localhost:8000`.

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
