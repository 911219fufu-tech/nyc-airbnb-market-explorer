# NYC Airbnb Visualization Website

Interactive course project for exploring NYC Airbnb market dynamics through a web-based visualization dashboard.

## Run Locally

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Regenerate processed data if needed:

```bash
python3 scripts/prepare_datasets.py
```

4. Start the Flask app:

```bash
python3 app.py
```

5. Open the website in your browser:

[http://127.0.0.1:5000](http://127.0.0.1:5000)

## Project Structure

- `app.py`
  Local entry point.
- `src/`
  Flask app package with routes, services, and utilities.
- `templates/`
  HTML templates and reusable template macros.
- `static/css/`
  Stylesheets grouped by responsibility.
- `static/js/`
  Frontend modules grouped by responsibility.
- `data/raw/`
  Original datasets.
- `data/processed/`
  Cleaned and aggregated datasets used by the app.

## Current Dashboard Modules

- filter panel
- KPI summary cards
- ZIP-level map
- monthly time series
- room type comparison
- property type comparison
- listing-level scatter plot

## Notes

- The raw `neighborhood` field is normalized into `zip_code` in processed outputs.
- The frontend uses Plotly.js from a CDN for interactive charts.
