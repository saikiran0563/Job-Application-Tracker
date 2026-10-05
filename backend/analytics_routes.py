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

    interview_rate = 0
    selection_rate = 0
    rejection_rate = 0

    if total_applications > 0:
        interview_rate = round(
            (interview / total_applications) * 100,
            2
        )

        selection_rate = round(
            (selected / total_applications) * 100,
            2
        )

        rejection_rate = round(
            (rejected / total_applications) * 100,
            2
        )

    return jsonify({
        "total_applications": total_applications,
        "applied": applied,
        "interview": interview,
        "rejected": rejected,
        "selected": selected,
        "interview_rate": interview_rate,
        "selection_rate": selection_rate,
        "rejection_rate": rejection_rate
    }), 200