from __future__ import annotations

import json
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "raw"
PROCESSED_DIR = ROOT / "data" / "processed"
RAW_LISTINGS_PATH = RAW_DIR / "listings_monthly.csv"

NUMERIC_COLUMNS = [
    "latitude",
    "longitude",
    "guests",
    "bedrooms",
    "beds",
    "baths",
    "num_reviews",
    "star_rating",
    "available_days",
    "unavailable_days",
    "occupancy",
    "avg_daily_rate",
    "native_avg_daily_rate",
    "revenue",
    "native_revenue",
    "booking_lead_time_avg",
    "length_of_stay_avg",
    "booked_rate_avg",
    "revpar",
    "native_revpar",
]

CATEGORY_COLUMNS = [
    "listing_type",
    "room_type",
    "property_type",
    "country",
    "currency",
]


def normalize_zip(value: object) -> str:
    if pd.isna(value):
        return "Unknown"

    text = str(value).strip()
    if not text or text.lower() == "nan":
        return "Unknown"
    if text.endswith(".0"):
        text = text[:-2]

    digits = "".join(char for char in text if char.isdigit())
    if len(digits) == 5:
        return digits
    if digits:
        return digits.zfill(5)[-5:]
    return text


def normalize_bool(value: object) -> bool | None:
    if pd.isna(value):
        return None

    text = str(value).strip().lower()
    if text in {"true", "1", "yes"}:
        return True
    if text in {"false", "0", "no"}:
        return False
    return None


def load_and_clean() -> pd.DataFrame:
    df = pd.read_csv(RAW_LISTINGS_PATH)

    for column in NUMERIC_COLUMNS:
        df[column] = pd.to_numeric(df[column], errors="coerce")

    df["month_date"] = pd.to_datetime(df["month_date"], errors="coerce")
    df = df.dropna(subset=["month_date"]).copy()

    for column in CATEGORY_COLUMNS:
        df[column] = df[column].fillna("Unknown").astype(str).str.strip()
        df.loc[df[column] == "", column] = "Unknown"

    df["zip_code"] = df["neighborhood"].apply(normalize_zip)
    df = df[df["zip_code"] != "Unknown"].copy()
    df["active"] = df["active"].apply(normalize_bool)
    df["superhost"] = df["superhost"].apply(normalize_bool)
    df["month"] = df["month_date"].dt.strftime("%Y-%m")
    df["year"] = df["month_date"].dt.year

    selected_columns = [
        "listing_id",
        "host_id",
        "month_date",
        "month",
        "year",
        "zip_code",
        "latitude",
        "longitude",
        "listing_type",
        "room_type",
        "property_type",
        "country",
        "currency",
        "guests",
        "bedrooms",
        "beds",
        "baths",
        "num_reviews",
        "star_rating",
        "superhost",
        "active",
        "available_days",
        "unavailable_days",
        "occupancy",
        "avg_daily_rate",
        "revenue",
        "revpar",
        "booking_lead_time_avg",
        "length_of_stay_avg",
        "booked_rate_avg",
    ]

    return (
        df[selected_columns]
        .sort_values(["month_date", "listing_id"])
        .reset_index(drop=True)
    )


def build_group_summary(df: pd.DataFrame, dimensions: list[str]) -> pd.DataFrame:
    grouped = (
        df.groupby(dimensions, dropna=False)
        .agg(
            listing_count=("listing_id", "nunique"),
            host_count=("host_id", "nunique"),
            active_listing_count=("active", lambda s: int(s.fillna(False).sum())),
            avg_daily_rate_mean=("avg_daily_rate", "mean"),
            avg_daily_rate_median=("avg_daily_rate", "median"),
            occupancy_mean=("occupancy", "mean"),
            revenue_mean=("revenue", "mean"),
            revenue_median=("revenue", "median"),
            revpar_mean=("revpar", "mean"),
            star_rating_mean=("star_rating", "mean"),
            superhost_share=("superhost", lambda s: s.dropna().mean() if not s.dropna().empty else None),
            latitude_mean=("latitude", "mean"),
            longitude_mean=("longitude", "mean"),
        )
        .reset_index()
    )
    return grouped.sort_values(dimensions).reset_index(drop=True)


def build_monthly_overview(df: pd.DataFrame) -> pd.DataFrame:
    return (
        df.groupby(["month_date", "month"])
        .agg(
            listing_count=("listing_id", "nunique"),
            host_count=("host_id", "nunique"),
            avg_daily_rate_mean=("avg_daily_rate", "mean"),
            occupancy_mean=("occupancy", "mean"),
            revenue_mean=("revenue", "mean"),
            revpar_mean=("revpar", "mean"),
            star_rating_mean=("star_rating", "mean"),
        )
        .reset_index()
        .sort_values("month_date")
    )


def build_latest_snapshot(df: pd.DataFrame) -> pd.DataFrame:
    return (
        df.sort_values(["listing_id", "month_date"])
        .groupby("listing_id", as_index=False)
        .tail(1)
        .sort_values("listing_id")
        .reset_index(drop=True)
    )


def build_metadata(df: pd.DataFrame) -> dict:
    return {
        "dataset_name": "NYC Airbnb listings monthly",
        "source_file": str(RAW_LISTINGS_PATH.relative_to(ROOT)),
        "row_count": int(len(df)),
        "listing_count": int(df["listing_id"].nunique()),
        "host_count": int(df["host_id"].nunique()),
        "date_min": df["month_date"].min().strftime("%Y-%m-%d"),
        "date_max": df["month_date"].max().strftime("%Y-%m-%d"),
        "zip_code_count": int(df["zip_code"].nunique()),
        "room_types": sorted(df["room_type"].dropna().unique().tolist()),
        "property_types": sorted(df["property_type"].dropna().unique().tolist()),
        "core_metrics": ["avg_daily_rate", "occupancy", "revenue", "revpar", "star_rating"],
        "missing_rate": {
            column: round(float(df[column].isna().mean()), 4)
            for column in [
                "star_rating",
                "bedrooms",
                "guests",
                "superhost",
                "booking_lead_time_avg",
                "length_of_stay_avg",
                "booked_rate_avg",
            ]
        },
    }


def write_outputs(df: pd.DataFrame) -> None:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    df.to_csv(PROCESSED_DIR / "listings_monthly_clean.csv", index=False)
    build_monthly_overview(df).to_csv(PROCESSED_DIR / "monthly_overview.csv", index=False)
    build_group_summary(df, ["month_date", "month", "zip_code"]).to_csv(
        PROCESSED_DIR / "zip_monthly_summary.csv",
        index=False,
    )
    build_group_summary(df, ["month_date", "month", "room_type"]).to_csv(
        PROCESSED_DIR / "room_type_monthly_summary.csv",
        index=False,
    )
    build_group_summary(df, ["month_date", "month", "property_type"]).to_csv(
        PROCESSED_DIR / "property_type_monthly_summary.csv",
        index=False,
    )
    build_latest_snapshot(df).to_csv(PROCESSED_DIR / "listing_latest_snapshot.csv", index=False)

    with (PROCESSED_DIR / "metadata_summary.json").open("w", encoding="utf-8") as handle:
        json.dump(build_metadata(df), handle, indent=2)


def main() -> None:
    if not RAW_LISTINGS_PATH.exists():
        raise FileNotFoundError(f"Missing raw dataset: {RAW_LISTINGS_PATH}")

    df = load_and_clean()
    write_outputs(df)

    print("Prepared dataset files in data/processed")
    print(f"Rows: {len(df)}")
    print(f"Unique listings: {df['listing_id'].nunique()}")
    print(f"Date range: {df['month_date'].min().date()} to {df['month_date'].max().date()}")


if __name__ == "__main__":
    main()
