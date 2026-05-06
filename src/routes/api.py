from flask import Blueprint, jsonify, request

from ..services.dashboard_service import (
    build_category_summary,
    build_filter_metadata,
    build_kpis,
    build_map_summary,
    build_scatter_points,
    build_timeseries,
)


api_bp = Blueprint("api", __name__)


def _collect_filters() -> dict:
    return {
        "start_month": request.args.get("start_month"),
        "end_month": request.args.get("end_month"),
        "room_types": request.args.getlist("room_type"),
        "property_types": request.args.getlist("property_type"),
        "zip_codes": request.args.getlist("zip_code"),
    }


@api_bp.get("/metadata")
def metadata():
    return jsonify(build_filter_metadata())


@api_bp.get("/kpis")
def kpis():
    return jsonify(build_kpis(_collect_filters()))


@api_bp.get("/timeseries")
def timeseries():
    metric = request.args.get("metric", "revenue")
    return jsonify(build_timeseries(_collect_filters(), metric))


@api_bp.get("/categories/<dimension>")
def categories(dimension: str):
    return jsonify(build_category_summary(_collect_filters(), dimension))


@api_bp.get("/map")
def map_data():
    metric = request.args.get("metric", "revenue")
    return jsonify(build_map_summary(_collect_filters(), metric))


@api_bp.get("/scatter")
def scatter_data():
    metric = request.args.get("metric", "revenue")
    return jsonify(build_scatter_points(_collect_filters(), metric))
