
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, extract

from models import JobApplication
from extensions import db

analytics_bp = Blueprint(
    "analytics",
    __name__,
    url_prefix="/api/analytics"
)


@analytics_bp.get("")
@jwt_required()
def get_analytics():
    user_id = int(get_jwt_identity())

    # Only count applications belonging to the authenticated user.
    user_jobs = JobApplication.query.filter_by(user_id=user_id)

    total_applications = user_jobs.count()
    applied = user_jobs.filter_by(status="Applied").count()
    interview = user_jobs.filter_by(status="Interview").count()
    rejected = user_jobs.filter_by(status="Rejected").count()
    selected = user_jobs.filter_by(status="Selected").count()

    interview_rate = 0
    selection_rate = 0
    rejection_rate = 0

    if total_applications > 0:
        interview_rate = round(
            (interview / total_applications) * 100, 2
        )
        selection_rate = round(
            (selected / total_applications) * 100, 2
        )
        rejection_rate = round(
            (rejected / total_applications) * 100, 2
        )

    # Group applications by year and month.
    monthly_results = (
        db.session.query(
            extract("year", JobApplication.application_date).label("year"),
            extract("month", JobApplication.application_date).label("month"),
            func.count(JobApplication.id).label("count")
        )
        .filter(JobApplication.user_id == user_id)
        .group_by(
            extract("year", JobApplication.application_date),
            extract("month", JobApplication.application_date)
        )
        .order_by(
            extract("year", JobApplication.application_date),
            extract("month", JobApplication.application_date)
        )
        .all()
    )

    monthly_applications = [
        {
            "month": f"{int(year):04d}-{int(month):02d}",
            "count": count
        }
        for year, month, count in monthly_results
    ]

    return jsonify({
        "total_applications": total_applications,
        "applied": applied,
        "interview": interview,
        "rejected": rejected,
        "selected": selected,
        "interview_rate": interview_rate,
        "selection_rate": selection_rate,
        "rejection_rate": rejection_rate,
        "monthly_applications": monthly_applications
    }), 200
