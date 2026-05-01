# Project Structure

## Current File Classification

### Root

- `AGENTS.md`
  Development rules and project constraints.

### `data/`

- `data/raw/`
  Original datasets.
- `data/processed/`
  Cleaned and aggregated datasets for the website.
- `data/README.md`
  Data catalog and processing notes.

### `docs/`

- `docs/planning/`
  Project specification and writing plans.
- `docs/course_materials/lectures/`
  Course lecture PDFs used as design references.
- `docs/research_papers/papers/`
  Research papers for literature survey and design grounding.
- `docs/submission/`
  Submission-related source assets such as the approved abstract.

### `scripts/`

- data preparation and project utility scripts

## Intended Next Development Folders

- `templates/`
  HTML templates for the website.
- `static/css/`
  Stylesheets.
- `static/js/`
  Frontend interaction logic.

## Organization Rules

- keep raw data immutable
- put generated datasets in `data/processed/`
- keep planning and report-support documents under `docs/`
- keep executable project logic in `scripts/` or application source folders
- avoid mixing lecture materials, research papers, and implementation files in the same directory
