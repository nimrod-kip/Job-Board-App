from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from marshmallow import Schema, fields, validate
from sqlalchemy.exc import IntegrityError

from config import  Config
from models import db, User, Company, Job, Application

# --- Schemas with validation ---
class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    full_name = fields.Str(required=True, validate=validate.Length(min=2))
    email = fields.Email(required=True)
    phone = fields.Str()
class CompanySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    website = fields.Url()
    description = fields.Str()
class JobSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=3))
    location = fields.Str()
    salary = fields.Int(validate=validate.Range(min=0))
    description = fields.Str()
    company_id = fields.Int(required=True)
class ApplicationSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    job_id = fields.Int(required=True)
    resume_url = fields.Url()
    cover_letter = fields.Str(validate=validate.Length(max=5000))
    expected_salary = fields.Int(validate=validate.Range(min=0))
    status = fields.Str(validate=validate.OneOf(["submitted","reviewed","rejected","hired"]))

user_schema, users_schema = UserSchema(), UserSchema(many=True)
company_schema, companies_schema = CompanySchema(), CompanySchema(many=True)
job_schema, jobs_schema = JobSchema(), JobSchema(many=True)
application_schema, applications_schema = ApplicationSchema(), ApplicationSchema(many=True)

# --- App factory ---
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    Migrate(app, db)
    CORS(app)

    # Users
    @app.route("/api/users", methods=["POST"])
    def create_user():
        data = request.get_json()
        try:
            user = User(**user_schema.load(data))
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {"error": "Email already exists"}, 400
        return user_schema.dump(user), 201

    @app.route("/api/users", methods=["GET"])
    def list_users():
        return users_schema.dump(User.query.all()), 200

    # Companies
    @app.route("/api/companies", methods=["POST"])
    def create_company():
        data = request.get_json()
        try:
            c = Company(**company_schema.load(data))
            db.session.add(c)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {"error": "Company already exists"}, 400
        return company_schema.dump(c), 201

    @app.route("/api/companies", methods=["GET"])
    def list_companies():
        return companies_schema.dump(Company.query.all()), 200

    # Jobs (full CRUD)
    @app.route("/api/jobs", methods=["POST"])
    def create_job():
        data = request.get_json()
        j = Job(**job_schema.load(data))
        db.session.add(j)
        db.session.commit()
        return job_schema.dump(j), 201

    @app.route("/api/jobs", methods=["GET"])
    def list_jobs():
        return jobs_schema.dump(Job.query.all()), 200

    @app.route("/api/jobs/<int:id>", methods=["GET"])
    def get_job(id):
        j = Job.query.get_or_404(id)
        return job_schema.dump(j), 200

    @app.route("/api/jobs/<int:id>", methods=["PATCH"])
    def update_job(id):
        j = Job.query.get_or_404(id)
        data = request.get_json()
        for k,v in job_schema.load(data, partial=True).items():
            setattr(j, k, v)
        db.session.commit()
        return job_schema.dump(j), 200

    @app.route("/api/jobs/<int:id>", methods=["DELETE"])
    def delete_job(id):
        j = Job.query.get_or_404(id)
        db.session.delete(j)
        db.session.commit()
        return {"message": "Job deleted"}, 200

    # Applications
    @app.route("/api/applications", methods=["POST"])
    def create_app_fn():
        data = request.get_json()
        app_obj = Application(**application_schema.load(data))
        db.session.add(app_obj)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {"error": "Duplicate application"}, 400
        return application_schema.dump(app_obj), 201

    @app.route("/api/applications", methods=["GET"])
    def list_applications():
        return applications_schema.dump(Application.query.all()), 200

    return app

# Create app instance for imports
app = create_app()

# Entry point
if __name__ == "__main__":
    app.run(debug=True)
