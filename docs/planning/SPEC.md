# NYC Airbnb Visualization Website Spec

## 1. Project Summary

### Working Title
Interactive Web-based Visualization System for Exploring NYC Airbnb Market Dynamics

### Project Type
Course final project for Information Visualization

### Core Deliverable
A browser-based interactive visualization website built with:

- Python
- HTML
- CSS
- JavaScript

### Primary Goal
Build a working visualization system that helps users explore spatial, temporal, and categorical patterns in the NYC Airbnb market, with a focus on price, occupancy, and revenue behavior.

## 2. Problem Definition

The project addresses the problem of understanding how Airbnb listing performance varies across time, area, and property characteristics in New York City.

Raw tabular data is difficult to interpret because users must compare:

- many listings
- multiple time periods
- multiple performance metrics
- several listing attributes at once

The website should transform this data into an interactive visual analytics experience that supports exploration and insight generation.

## 3. Target Users

Primary target users:

- prospective Airbnb hosts
- small-scale property managers
- students or analysts exploring urban short-term rental patterns

## 4. User Questions

The system should help users answer these questions:

1. Which areas show stronger Airbnb performance in terms of price, occupancy, and revenue?
2. How do room type and property type affect listing performance?
3. How does the market change over time?
4. Are there tradeoffs or relationships between price, occupancy, rating, and revenue?
5. Which subsets of listings appear more stable or more volatile over time?

## 5. Analytical Tasks

The interface should support these analytical tasks:

- filter listings by time and category
- compare areas
- compare room types and property types
- inspect temporal trends
- inspect distribution spread and outliers
- identify correlations between key metrics
- drill into subsets without losing global context

## 6. Dataset Scope

### Current Main Dataset
`data/raw/listings_monthly.csv`

### Processed Outputs for the Website

- `data/processed/listings_monthly_clean.csv`
- `data/processed/monthly_overview.csv`
- `data/processed/zip_monthly_summary.csv`
- `data/processed/room_type_monthly_summary.csv`
- `data/processed/property_type_monthly_summary.csv`
- `data/processed/listing_latest_snapshot.csv`
- `data/processed/metadata_summary.json`

### Known Characteristics

- monthly Airbnb listing records
- around 35k rows
- around 1,000 unique listings
- date range approximately `2021-03` to `2026-02`

### Important Column Groups

- identity: `listing_id`, `host_id`
- location: `latitude`, `longitude`, `neighborhood`
- category: `listing_type`, `room_type`, `property_type`
- quality: `star_rating`, `superhost`, `num_reviews`
- performance: `avg_daily_rate`, `occupancy`, `revenue`, `revpar`
- time: `month_date`

### Data Caveats

- `neighborhood` appears to behave like ZIP code rather than a human-readable neighborhood label
- several attributes may contain missing values, such as `star_rating` and `bedrooms`
- monetary variables are likely right-skewed
- monthly aggregation hides day-level behavior

## 7. System Scope

### In Scope

- one polished interactive dashboard website
- multiple coordinated views
- dynamic filtering
- hover and click interaction
- readable explanatory text
- reproducible local execution

### Out of Scope

- user login
- database deployment
- heavy machine learning pipeline
- mobile app
- full production hosting pipeline unless time remains

## 8. Recommended Tech Stack

### Backend

- Python
- Flask

### Frontend

- HTML
- CSS
- JavaScript

### Visualization Library

- Plotly.js for charts
- optional use of Leaflet or Plotly map layers for spatial view

### Data Flow

1. Python loads and preprocesses CSV data
2. Flask exposes routes and API endpoints
3. JavaScript fetches processed data from backend endpoints
4. HTML/CSS render layout and interface
5. Plotly.js draws interactive views

## 9. Information Architecture

### Single-Page Dashboard

The website should use one main dashboard page rather than multiple disconnected pages.

### Main Layout Zones

- top header with title and short project description
- filter panel
- KPI summary row
- map view
- time series view
- categorical comparison view
- relationship or distribution view
- insight / notes panel

## 10. Required Views

### View 1: KPI Summary
Purpose:
Provide quick context after filters are applied.

Suggested metrics:

- listing count
- average daily rate
- average occupancy
- average monthly revenue

### View 2: Spatial View
Purpose:
Show geographic distribution of listings and performance.

Candidate encodings:

- point position by latitude/longitude
- color by metric or category
- size by revenue or occupancy

Recommended interactions:

- hover for listing details
- click or lasso to filter other charts

### View 3: Time Series View
Purpose:
Reveal temporal trend and seasonality.

Suggested metrics:

- average daily rate over time
- occupancy over time
- revenue over time

Recommended interactions:

- metric switcher
- range selection
- linked filtering from other views

### View 4: Category Comparison View
Purpose:
Compare room types, property types, or selected areas.

Suggested chart types:

- grouped bar chart
- box plot
- violin plot

### View 5: Relationship / Distribution View
Purpose:
Reveal tradeoffs, spread, and outliers.

Suggested chart types:

- scatter plot
- histogram
- box plot

Suggested relationships:

- price vs occupancy
- rating vs revenue
- bedrooms vs revenue

## 11. Required Interactions

The website should include at least:

- date range filtering
- room type filtering
- property type filtering
- area or ZIP filtering
- hover tooltips
- click-based selection
- linked updates across multiple views
- reset filters control

Optional stronger interactions:

- metric dropdown
- sort toggle
- brush or lasso selection
- annotation toggle

## 12. Visualization Design Principles

The design should explicitly follow course principles.

### Encoding

- use position for precise quantitative comparison
- use color mainly for category or secondary emphasis
- avoid using area or size alone for exact comparison

### Color

- use an accessible palette
- avoid relying on color alone to encode critical distinctions
- use sequential scales for ordered values and categorical scales for categories

### Perception

- avoid chart clutter
- maintain strong visual hierarchy
- keep labels readable
- avoid misleading truncation or distorted scales unless clearly justified

### Accessibility

- sufficient contrast
- readable font sizes
- keyboard-friendly controls when feasible
- legends and labels that do not depend only on color

## 13. Visual Style Direction

The website should feel like an intentional course project rather than a default admin dashboard.

Design direction:

- clean light theme
- structured grid layout
- restrained but distinctive color system
- clear section titles
- subtle emphasis for active filters and insights

Avoid:

- overly dark interface by default
- random color overload
- crowded panels
- excessive decoration that competes with the data

## 14. Data Processing Requirements

The preprocessing stage should:

- parse dates correctly
- clean missing or invalid values
- standardize categorical values where needed
- prepare aggregates for fast frontend loading
- document every transformation

Potential prepared outputs:

- cleaned listing-level monthly table
- aggregated area-level metrics by month
- aggregated room-type metrics by month

## 15. Minimum Project File Structure

```text
final_/
  AGENTS.md
  data/
    README.md
    raw/
    processed/
  docs/
    PROJECT_STRUCTURE.md
    planning/
      SPEC.md
      REPORT_PLAN.md
      SLIDES_PLAN.md
    course_materials/
    research_papers/
    submission/
  scripts/
    prepare_datasets.py
  app.py
  requirements.txt
  README.md
  static/
    css/
      style.css
    js/
      app.js
  templates/
    index.html
```

## 16. Functional Requirements

The finished website must:

- run locally without major errors
- load the main dataset
- render all main charts
- respond to filters
- update views without requiring a page reload
- present clear explanatory text

## 17. Non-Functional Requirements

The website should:

- load within a reasonable time on local machine
- keep code modular and readable
- separate data logic from presentation logic
- be easy to reproduce from README instructions

## 18. Rubric Alignment

### Problem & Data Understanding

- clearly define user and analytical tasks
- explain dataset structure and limitations

### Visualization Design Quality

- justify chart choices with encoding and perception principles
- use accessible color and clean layout

### Technical Implementation

- working Flask app
- modular frontend and backend
- reproducible setup

### Interaction & User Experience

- meaningful filter and linked-view behavior
- intuitive interface with clear feedback

### Innovation & Depth

- support multi-perspective exploration
- produce interpretable findings instead of static display

### Literature Survey

- connect prior work to design choices

### Presentation & Communication

- support report screenshots, demo flow, and slide storytelling

## 19. Stretch Goals

If time remains, consider:

- annotated insight callouts based on current filters
- ranking panel for top-performing areas
- toggle between area-level and listing-level views
- simple forecasting or trend summary panel
- hosted deployment

## 20. Definition of Done

The website portion is complete when:

- the dashboard runs locally
- the main views are interactive
- filters and linked views work
- the design is readable and accessible
- the system supports at least three concrete insights
- the codebase is organized and documented
