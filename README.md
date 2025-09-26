# Job Board App

## Overview
Job Board App is a full-stack web application that allows **companies** to post job listings, **job seekers** to browse and apply for jobs, and **admins** to manage users, companies, and applications.  
The app uses a **Flask backend** (with SQLAlchemy for database models) and a **React frontend** for user interaction.

---

## Features
- Companies can create, update, and delete job postings.
- Job seekers can browse job listings and submit applications with resume and cover letter.
- Admins can manage users, companies, job postings, and applications.
- Formik forms with validation (string, number, and format validations).
- RESTful API with Flask (GET, POST, PATCH, DELETE).
- React Router for navigation with at least 3 client-side routes.
- Data serialization with Marshmallow / SQLAlchemy Serializer.

---

## Data Models

### User
- id (PK)
- name (string)
- email (string, validated format)
- role (enum: "admin", "company", "job_seeker")

### Company
- id (PK)
- name (string)
- description (text)
- owner_id (FK → User)

### Job
- id (PK)
- title (string)
- description (text)
- company_id (FK → Company)

### Application (Join Table)
- id (PK)
- user_id (FK → User)
- job_id (FK → Job)
- cover_letter (text)
- resume_link (string)

---

## 🔗 Relationships
- One-to-Many: Company → Jobs
- One-to-Many: Job → Applications
- Many-to-Many: Users ↔ Jobs through Applications

---

## User Stories (MVP)
1. As a **company**, I want to create and manage job postings so that I can hire suitable candidates.  
2. As a **job seeker**, I want to browse available jobs and submit an application with my resume and cover letter.  
3. As an **admin**, I want to view and manage all job listings and applications so that I can monitor activity on the platform.  

---

## Tech Stack
- **Backend:** Flask, SQLAlchemy, Marshmallow
- **Frontend:** React, React Router, Formik
- **Database:** SQLite / PostgreSQL
- **Styling:** CSS / TailwindCSS

---

## Installation

### Backend Setup
```bash
cd server
pip install -r requirements.txt
flask db init
flask db migrate -m "Initial migration."
flask db upgrade
flask run
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

---

##  Extra Features (if time permits)
- Authentication & Authorization (login/logout system).
- Job search and filtering (by title, location, or company).
- Profile pages for companies and job seekers.
- Dark mode UI option.

---
## Authors
  Nimrod Kipngetich
  Maurice Mwangi

##  License
This project is for educational purposes as part of the Phase 4 Full-Stack Project.