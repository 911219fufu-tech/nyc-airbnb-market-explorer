from __future__ import annotations

from typing import Iterable

import pandas as pd

from .data_repository import repository


VALID_METRICS = {"avg_daily_rate", "occupancy", "revenue", "revpar", "star_rating"}
VALID_DIMENSIONS = {"room_type", "property_type"}
MAP_METRIC_FIELD = {
    "avg_daily_rate": "avg_daily_rate",
    "occupancy": "avg_occupancy",
    "revenue": "avg_revenue",
    "revpar": "avg_revpar",
    "star_rating": "star_rating",
}


def _normalize_values(values: Iterable[str] | None) -> list[str]:
    if not values:
        return []

    normalized: list[str] = []
    for value in values:
        if value is None:
            continue
        normalized.extend([part.strip() for part in str(value).split(",") if part.strip()])
    return normalized


def _apply_filters(filters: dict) -> pd.DataFrame:
    df = repository.get_clean_listings().copy()

    start_month = filters.get("start_month")
    end_month = filters.get("end_month")
    room_types = _normalize_values(filters.get("room_types"))
    property_types = _normalize_values(filters.get("property_types"))
    zip_codes = _normalize_values(filters.get("zip_codes"))

    if start_month:
        df = df[df["month"] >= start_month]
    if end_month:
        df = df[df["month"] <= end_month]
    if room_types:
        df = df[df["room_type"].isin(room_types)]
    if property_types:
        df = df[df["property_type"].isin(property_types)]
    if zip_codes:
        df = df[df["zip_code"].astype(str).isin(zip_codes)]

    return df


def _safe_round(value: float | int | None, digits: int = 2) -> float | None:
    if value is None or pd.isna(value):
        return None
    return round(float(value), digits)


def build_filter_metadata() -> dict:
    df = repository.get_clean_listings()
    metadata = repository.get_metadata()

    zip_codes = sorted(
        df.loc[df["zip_code"].astype(str) != "Unknown", "zip_code"]
        .dropna()
        .astype(str)
        .unique()
        .tolist()
    )
    months = sorted(df["month"].dropna().unique().tolist())

    return {
        **metadata,
        "months": months,
        "zip_codes": zip_codes,
    }


def build_kpis(filters: dict) -> dict:
    df = _apply_filters(filters)

    return {
        "listing_count": int(df["listing_id"].nunique()),
        "host_count": int(df["host_id"].nunique()),
        "avg_daily_rate": _safe_round(df["avg_daily_rate"].mean()),
        "avg_occupancy": _safe_round(df["occupancy"].mean()),
        "avg_revenue": _safe_round(df["revenue"].mean()),
        "avg_revpar": _safe_round(df["revpar"].mean()),
    }


def build_timeseries(filters: dict, metric: str) -> dict:
    metric = metric if metric in VALID_METRICS else "revenue"
    df = _apply_filters(filters)

    grouped = (
        df.groupby(["month_date", "month"], dropna=False)[metric]
        .mean()
        .reset_index()
        .sort_values("month_date")
    )

    return {
        "metric": metric,
        "points": [
            {"month": row.month, "value": _safe_round(getattr(row, metric))}
            for row in grouped.itertuples(index=False)
        ],
    }


def build_category_summary(filters: dict, dimension: str) -> dict:
    dimension = dimension if dimension in VALID_DIMENSIONS else "room_type"
    df = _apply_filters(filters)

    grouped = (
        df.groupby(dimension, dropna=False)
        .agg(
            listing_count=("listing_id", "nunique"),
            avg_daily_rate=("avg_daily_rate", "mean"),
            avg_occupancy=("occupancy", "mean"),
            avg_revenue=("revenue", "mean"),
            avg_revpar=("revpar", "mean"),
        )
        .reset_index()
        .sort_values("avg_revenue", ascending=False)
    )

    records = []
    for row in grouped.itertuples(index=False):
        records.append(
            {
                "label": getattr(row, dimension),
                "listing_count": int(row.listing_count),
                "avg_daily_rate": _safe_round(row.avg_daily_rate),
                "avg_occupancy": _safe_round(row.avg_occupancy),
                "avg_revenue": _safe_round(row.avg_revenue),
                "avg_revpar": _safe_round(row.avg_revpar),
            }
        )

    return {
        "dimension": dimension,
        "items": records,
    }


def build_map_summary(filters: dict, metric: str) -> dict:
    metric = metric if metric in VALID_METRICS else "revenue"
    df = _apply_filters(filters)

    if df.empty:
        return {
            "metric": metric,
            "points": [],
        }

    grouped = (
        df.groupby("zip_code", dropna=False)
        .agg(
            latitude=("latitude", "mean"),
            longitude=("longitude", "mean"),
            listing_count=("listing_id", "nunique"),
            avg_daily_rate=("avg_daily_rate", "mean"),
            avg_occupancy=("occupancy", "mean"),
            avg_revenue=("revenue", "mean"),
            avg_revpar=("revpar", "mean"),
            star_rating=("star_rating", "mean"),
        )
        .reset_index()
        .sort_values(MAP_METRIC_FIELD[metric], ascending=False)
    )

    if metric == "revenue":
        grouped = grouped[grouped["avg_revenue"] > 0].copy()

    points = []
    for row in grouped.itertuples(index=False):
        metric_value = getattr(row, MAP_METRIC_FIELD[metric], None)

        points.append(
            {
                "zip_code": row.zip_code,
                "latitude": _safe_round(row.latitude, 5),
                "longitude": _safe_round(row.longitude, 5),
                "listing_count": int(row.listing_count),
                "avg_daily_rate": _safe_round(row.avg_daily_rate),
                "avg_occupancy": _safe_round(row.avg_occupancy),
                "avg_revenue": _safe_round(row.avg_revenue),
                "avg_revpar": _safe_round(row.avg_revpar),
                "star_rating": _safe_round(row.star_rating),
                "metric_value": _safe_round(metric_value),
            }
        )

    return {
        "metric": metric,
        "points": points,
    }


def build_scatter_points(filters: dict, limit: int = 800) -> dict:
    df = _apply_filters(filters)
    latest_per_listing = (
        df.sort_values(["listing_id", "month_date"])
        .groupby("listing_id", as_index=False)
        .tail(1)
        .dropna(subset=["avg_daily_rate", "occupancy", "revenue"])
    )

    if len(latest_per_listing) > limit:
        latest_per_listing = latest_per_listing.nlargest(limit, "revenue")

    points = []
    for row in latest_per_listing.itertuples(index=False):
        points.append(
            {
                "listing_id": str(row.listing_id),
                "room_type": row.room_type,
                "property_type": row.property_type,
                "zip_code": row.zip_code,
                "avg_daily_rate": _safe_round(row.avg_daily_rate),
                "occupancy": _safe_round(row.occupancy),
                "revenue": _safe_round(row.revenue),
                "revpar": _safe_round(row.revpar),
                "star_rating": _safe_round(row.star_rating),
            }
        )

    return {"points": points}
