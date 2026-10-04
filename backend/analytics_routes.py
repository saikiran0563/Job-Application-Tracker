from flask import Blueprint, jsonify

from models import JobApplication
from extensions import db


analytics_bp = Blueprint(
    "analytics",
    __name__,
    url_prefix="/api/analytics"
)


@analytics_bp.get("")
def get_analytics():
    total_applications = JobApplication.query.count()

    applied = JobApplication.query.filter_by(
        status="Applied"
    ).count()

    interview = JobApplication.query.filter_by(
        status="Interview"
    ).count()

    rejected = JobApplication.query.filter_by(
        status="Rejected"
    ).count()

    selected = JobApplication.query.filter_by(
        status="Selected"
    ).count()

    return jsonify({
        "total_applications": total_applications,
        "applied": applied,
        "interview": interview,
        "rejected": rejected,
        "selected": selected
    }), 200