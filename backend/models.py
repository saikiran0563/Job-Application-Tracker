from datetime import date, datetime

from extensions import db


class JobApplication(db.Model):
    __tablename__ = "job_applications"

    id = db.Column(db.Integer, primary_key=True)

    company_name = db.Column(db.String(150), nullable=False)
    job_title = db.Column(db.String(150), nullable=False)

    job_url = db.Column(db.String(500), nullable=True)
    location = db.Column(db.String(150), nullable=True)
    job_type = db.Column(db.String(50), nullable=True)

    status = db.Column(
        db.String(50),
        nullable=False,
        default="Applied"
    )

    application_date = db.Column(
        db.Date,
        nullable=False,
        default=date.today
    )

    source = db.Column(db.String(100), nullable=True)
    salary = db.Column(db.String(100), nullable=True)
    notes = db.Column(db.Text, nullable=True)

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "company_name": self.company_name,
            "job_title": self.job_title,
            "job_url": self.job_url,
            "location": self.location,
            "job_type": self.job_type,
            "status": self.status,
            "application_date": (
                self.application_date.isoformat()
                if self.application_date
                else None
            ),
            "source": self.source,
            "salary": self.salary,
            "notes": self.notes,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at
                else None
            ),
        }