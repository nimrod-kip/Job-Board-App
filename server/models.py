from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(30))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    applications = db.relationship("Application", back_populates="user", cascade="all, delete-orphan")

class Company(db.Model):
    __tablename__ = "companies"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(140), unique=True, nullable=False)
    website = db.Column(db.String(255))
    description = db.Column(db.Text)

    jobs = db.relationship("Job", back_populates="company", cascade="all, delete-orphan")

class Job(db.Model):
    __tablename__ = "jobs"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(140), nullable=False)
    location = db.Column(db.String(140))
    salary = db.Column(db.Integer)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    company_id = db.Column(db.Integer, db.ForeignKey("companies.id"), nullable=False)
    company = db.relationship("Company", back_populates="jobs")

    applications = db.relationship("Application", back_populates="job", cascade="all, delete-orphan")
    applicants = db.relationship("User", secondary="applications", viewonly=True)

class Application(db.Model):
    __tablename__ = "applications"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=False)
    resume_url = db.Column(db.String(400))
    cover_letter = db.Column(db.Text)
    expected_salary = db.Column(db.Integer)
    status = db.Column(db.String(40), default="submitted")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="applications")
    job = db.relationship("Job", back_populates="applications")

    __table_args__ = (db.UniqueConstraint("user_id", "job_id", name="uq_user_job"),)
