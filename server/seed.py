from faker import Faker
from app import app
from models import  db, User, Company, Job, Application

fake = Faker()

with app.app_context():
    # clear existing data
    Application.query.delete()
    Job.query.delete()
    Company.query.delete()
    User.query.delete()

    # create users
    users = [User(full_name=fake.name(), email=fake.email()) for _ in range(10)]
    db.session.add_all(users)

    # create companies
    companies = [Company(name=fake.company(), website=fake.url()) for _ in range(5)]
    db.session.add_all(companies)

    db.session.commit()

    # create jobs
    jobs = []
    for company in companies:
        for _ in range(3):
            job = Job(
                title=fake.job(),
                description=fake.text(),
                company_id=company.id
            )
            jobs.append(job)
    db.session.add_all(jobs)
    db.session.commit()

    # create applications
    for user in users:
        for job in fake.random_elements(elements=jobs, length=2, unique=True):
            application = Application(
                user_id=user.id,
                job_id=job.id,
                cover_letter=fake.paragraph()
            )
            db.session.add(application)

    db.session.commit()
    print("Database seeded successfully ✅")
