from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

import pandas as pd

from ..config import BASE_DIR


PROCESSED_DIR = Path(BASE_DIR) / "data" / "processed"


class DataRepository:
    def __init__(self) -> None:
        self.processed_dir = PROCESSED_DIR

    @lru_cache(maxsize=1)
    def get_clean_listings(self) -> pd.DataFrame:
        path = self.processed_dir / "listings_monthly_clean.csv"
        df = pd.read_csv(path, parse_dates=["month_date"], low_memory=False)
        return df

    @lru_cache(maxsize=1)
    def get_latest_snapshot(self) -> pd.DataFrame:
        path = self.processed_dir / "listing_latest_snapshot.csv"
        df = pd.read_csv(path, parse_dates=["month_date"], low_memory=False)
        return df

    @lru_cache(maxsize=1)
    def get_metadata(self) -> dict:
        path = self.processed_dir / "metadata_summary.json"
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)


repository = DataRepository()
