from datetime import date, datetime

from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(150),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    jobs = db.relationship(
        "JobApplication",
        backref="user",
        lazy=True
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(
            self.password_hash,
            password
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
        }


class JobApplication(db.Model):
    __tablename__ = "job_applications"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=True
    )

    company_name = db.Column(
        db.String(150),
        nullable=False
    )

    job_title = db.Column(
        db.String(150),
        nullable=False
    )

    job_url = db.Column(
        db.String(500),
        nullable=True
    )

    location = db.Column(
        db.String(150),
        nullable=True
    )

    job_type = db.Column(
        db.String(50),
        nullable=True
    )

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

    source = db.Column(
        db.String(100),
        nullable=True
    )

    salary = db.Column(
        db.String(100),
        nullable=True
    )

    notes = db.Column(
        db.Text,
        nullable=True
    )

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
            "user_id": self.user_id,
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