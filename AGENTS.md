# AGENTS.md

## Project Context

This repository is a course final project for an Information Visualization class.

The project goal is to build a web-based interactive visualization system for exploring NYC Airbnb market dynamics using:

- Python
- HTML
- CSS
- JavaScript

Primary dataset:

- `data/raw/listings_monthly.csv`

## Product Direction

The application should be implemented as a single-page interactive dashboard with a Python backend and custom frontend.

Preferred stack:

- Flask for backend
- vanilla HTML/CSS/JavaScript for frontend
- Plotly.js for charts

Avoid replacing this with a notebook-first workflow or a different framework unless there is a strong technical reason.

## User Focus

Primary user:

- prospective Airbnb hosts
- small-scale property managers
- urban market analysts

The interface should help users compare area, room type, property type, and time-based performance patterns.

## Core Metrics

When implementing charts or summaries, prioritize:

- `avg_daily_rate`
- `occupancy`
- `revenue`
- `revpar`
- `star_rating`

## Data Notes

- `neighborhood` likely behaves like ZIP code rather than a neighborhood label
- processed outputs should use a normalized `zip_code` field
- date field is `month_date`
- data is monthly and should be treated as panel/time-series data
- missing values must be handled explicitly and documented
- monetary variables may be heavily skewed

## Required App Capabilities

The dashboard should eventually support:

- filtering by date range
- filtering by room type
- filtering by property type
- filtering by area or ZIP
- a spatial view
- a time series view
- a category comparison view
- a relationship or distribution view
- KPI summaries
- linked interactions across views

## Engineering Expectations

- keep backend, templates, styles, and scripts clearly separated
- write small reusable functions for data transforms
- avoid embedding large hard-coded datasets in HTML
- prefer API endpoints or structured server-side serialization
- preserve raw source data files
- do not mutate original CSV files in place
- write derived outputs to `data/processed/`

## File and Naming Guidance

Preferred structure:

```text
app.py
templates/index.html
static/css/style.css
static/js/app.js
data/
  raw/
  processed/
```

Keep naming consistent and descriptive.

## Visualization Guidance

- use accessible color palettes
- do not rely on color alone for critical distinctions
- use position for the most important quantitative comparisons
- keep labels and legends readable
- avoid overcrowded views

## UX Guidance

- keep the dashboard understandable on first load
- make the default state informative
- provide obvious filter controls
- include reset behavior
- keep tooltips concise and useful

## Report Alignment

Implementation choices should be easy to explain later in the final report under:

- design rationale
- system architecture
- interaction design
- insights
- limitations

If a feature is hard to justify in the report, it is likely not a priority.

## Constraints

- prioritize a working local website over premature deployment complexity
- prefer robust, readable implementation over experimental complexity
- keep the interface polished but realistic for course scope

## When Making Changes

- update documentation if architecture or file structure changes
- keep README instructions reproducible
- do not introduce unnecessary dependencies
- prefer simple solutions that directly improve rubric performance
