from flask import Blueprint, jsonify, request

from models import JobApplication
from extensions import db

job_bp = Blueprint("job", __name__, url_prefix="/api/jobs")


@job_bp.get("")
def get_jobs():
    status = request.args.get("status")
    search = request.args.get("search")

    query = JobApplication.query

    if status:
        query = query.filter_by(status=status)

    if search:
        search_term = f"%{search}%"

        query = query.filter(
            db.or_(
                JobApplication.company_name.ilike(search_term),
                JobApplication.job_title.ilike(search_term)
            )
        )

    jobs = query.order_by(
        JobApplication.application_date.desc()
    ).all()

    return jsonify([
        job.to_dict()
        for job in jobs
    ]), 200


@job_bp.route("", methods=["POST"])
def create_job():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "Request body must contain JSON data"
        }), 400

    required_fields = [
        "company_name",
        "job_title",
        "status",
        "application_date"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    job = JobApplication(
        company_name=data["company_name"],
        job_title=data["job_title"],
        job_url=data.get("job_url"),
        location=data.get("location"),
        job_type=data.get("job_type"),
        status=data["status"],
        application_date=data["application_date"],
        source=data.get("source"),
        salary=data.get("salary"),
        notes=data.get("notes")
    )

    db.session.add(job)
    db.session.commit()

    return jsonify({
        "message": "Job application created successfully",
        "job": job.to_dict()
    }), 201

@job_bp.get("/<int:job_id>")
def get_job(job_id):
    job = JobApplication.query.get(job_id)

    if not job:
        return jsonify({
            "error": "Job application not found"
        }), 404

    return jsonify(job.to_dict()), 200

@job_bp.put("/<int:job_id>")
def update_job(job_id):
    job = JobApplication.query.get(job_id)

    if not job:
        return jsonify({
            "error": "Job application not found"
        }), 404

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
        "error": "Request body must contain JSON data"
    }), 400

    job.company_name = data.get("company_name", job.company_name)
    job.job_title = data.get("job_title", job.job_title)
    job.job_url = data.get("job_url", job.job_url)
    job.location = data.get("location", job.location)
    job.job_type = data.get("job_type", job.job_type)
    job.status = data.get("status", job.status)
    job.application_date = data.get(
        "application_date",
        job.application_date
    )
    job.source = data.get("source", job.source)
    job.salary = data.get("salary", job.salary)
    job.notes = data.get("notes", job.notes)

    db.session.commit()

    return jsonify({
        "message": "Job application updated successfully",
        "job": job.to_dict()
    }), 200

@job_bp.delete("/<int:job_id>")
def delete_job(job_id):
    job = JobApplication.query.get(job_id)

    if not job:
        return jsonify({
            "error": "Job application not found"
        }), 404

    db.session.delete(job)
    db.session.commit()

    return jsonify({
        "message": "Job application deleted successfully"
    }), 200