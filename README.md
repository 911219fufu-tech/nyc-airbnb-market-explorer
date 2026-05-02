# NYC Airbnb Market Explorer

Interactive web-based visualization system for exploring spatial, temporal, and categorical patterns in the NYC Airbnb market.

This project was built as a final project for an Information Visualization course. The system is designed to help users compare Airbnb performance across ZIP codes, room types, and time using an interactive dashboard.

## Project Overview

### Problem

NYC Airbnb market data is difficult to interpret directly from raw tables because users need to compare:

- many listings
- multiple months
- multiple performance metrics
- multiple listing categories at once

This project turns those raw records into an interactive visual analytics website that supports exploration of:

- where stronger Airbnb performance appears spatially
- how market behavior changes over time
- how room types differ in revenue and occupancy
- how price, occupancy, and revenue relate at the listing level

### Target Users

- prospective Airbnb hosts
- small-scale property managers
- students or analysts studying short-term rental patterns

## Main Features

- interactive date range filtering
- room type multi-select
- property type multi-select
- ZIP code multi-select with `Select All` and `Clear`
- KPI summary cards
- map-based spatial distribution view
- monthly trend line chart
- room type comparison chart
- listing-level relationship scatter plot
- dynamic insight panel
- responsive dashboard layout

## Dashboard Views

### 1. Spatial Distribution

- Leaflet-based map
- ZIP-level aggregated values over the selected date range
- marker color reflects the selected metric
- marker size reflects listing count
- zoom supported through buttons, scroll wheel, and keyboard

### 2. Monthly Trend

- line chart showing how the selected metric changes over time
- summarizes the full selected date range

### 3. Room Type Comparison

- compares average revenue across room types
- useful for segment-level comparison

### 4. Listing-Level Relationship

- scatter plot of average daily rate vs occupancy
- marker size and color provide additional revenue context

## Tech Stack

### Backend

- Python
- Flask
- pandas

### Frontend

- HTML
- CSS
- JavaScript

### Visualization Libraries

- Plotly.js
- Leaflet

## Data

### Reference

Kaggle. *Airbnb Data: New York City 5Y (2021–2026)*  
<https://www.kaggle.com/datasets/jasonairroi/airbnb-short-term-rental-data-new-york-city>

### Files Used by the App

- raw input files are stored in `data/raw/`
- cleaned and aggregated files used by the dashboard are stored in `data/processed/`

### Data Processing Notes

- `month_date` is parsed into a monthly time field
- the raw `neighborhood` field is normalized into `zip_code`
- rows with unresolved ZIP codes are removed from processed outputs
- booleans such as `active` and `superhost` are normalized
- processed outputs are generated for reproducible dashboard development

See `data/README.md` for details.

## How To Run

### 1. Create a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Regenerate processed data if needed

```bash
python3 scripts/prepare_datasets.py
```

### 4. Start the Flask app

```bash
python3 app.py
```

### 5. Open the dashboard

[http://127.0.0.1:5000](http://127.0.0.1:5000)

## Example Usage

### Compare time ranges

1. Set `Start Month` and `End Month`
2. The map, KPIs, line chart, room type chart, and scatter plot update together

### Compare segments

1. Select one or more room types
2. Optionally narrow by property type
3. Compare how revenue and occupancy behave across the remaining views

### Compare areas

1. Use ZIP code checkboxes
2. Use `Select All` or `Clear` as needed
3. Inspect marker popups on the map for area-level metrics

## Project Structure

```text
final_/
  app.py
  README.md
  requirements.txt
  AGENTS.md
  data/
    README.md
    raw/
    processed/
  docs/
    PROJECT_STRUCTURE.md
    planning/
    course_materials/
    research_papers/
    submission/
  scripts/
    prepare_datasets.py
  src/
    config.py
    routes/
    services/
  static/
    css/
    js/
  templates/
    base.html
    index.html
    components/
```

### Important Files

- `app.py`
  Flask entry point.

- `scripts/prepare_datasets.py`
  Reproducible preprocessing pipeline for cleaned and aggregated data.

- `src/routes/api.py`
  JSON endpoints for dashboard data.

- `src/services/dashboard_service.py`
  Filtering and aggregation logic for the dashboard.

- `templates/index.html`
  Main dashboard layout.

- `static/js/dashboard/dashboardController.js`
  Frontend dashboard orchestration.

## Design Choices

- `Spatial Distribution` is the primary view because the problem has a strong geographic component.
- `Monthly Trend` preserves the temporal dimension of the selected range.
- `Room Type Comparison` supports categorical analysis.
- `Listing-Level Relationship` helps reveal tradeoffs between price and occupancy.
- KPI cards provide quick context before users inspect detailed views.

## Reproducibility

This repository includes:

- source code
- raw and processed data
- preprocessing script
- dependency list
- local run instructions

The dashboard should be reproducible by installing dependencies, regenerating processed data if needed, and running the Flask app locally.

## Known Limitations

- the dashboard uses ZIP-level aggregation rather than named neighborhoods
- monthly aggregation hides day-level behavior
- some records contain zero revenue because a listing had no bookings in that month
- the frontend depends on CDN-loaded Plotly.js and Leaflet assets
- interaction is currently filter-driven rather than full cross-view brushing

## Troubleshooting

### The page loads but charts do not render

- refresh the browser once
- check that internet access is available for Plotly.js and Leaflet CDN assets
- check the browser console for JavaScript errors

### Processed data seems out of date

Run:

```bash
python3 scripts/prepare_datasets.py
```

### The app does not start

Make sure dependencies are installed:

```bash
pip install -r requirements.txt
```

Then run:

```bash
python3 app.py
```

## Submission-Ready Contents

For the code portion of the final submission, this repository currently includes:

- working visualization website
- preprocessing script
- raw and processed data
- dependency file
- README with setup and usage instructions

Related planning documents are stored under:

- `docs/planning/SPEC.md`
- `docs/planning/REPORT_PLAN.md`
- `docs/planning/SLIDES_PLAN.md`
