# NextGen Corporate Platform

### AI-Powered Corporate Website & Automated Enquiry Management System

A full-stack corporate platform that helps businesses collect, analyse,
organise, and manage customer enquiries through a structured workflow.
The application combines a public-facing corporate website with an
administrative enquiry management interface and AI-assisted enquiry
analysis.

> **Project focus:** Save-first enquiry processing, LLM-assisted triage,
> enquiry lifecycle management, and workflow automation.

------------------------------------------------------------------------

## Table of Contents

-   [Project Overview](#project-overview)
-   [Problem Statement](#problem-statement)
-   [Key Features](#key-features)
-   [Enquiry Lifecycle](#enquiry-lifecycle)
-   [System Architecture](#system-architecture)
-   [Technology Stack](#technology-stack)
-   [My Role and Contributions](#my-role-and-contributions)
-   [Backend Processing Workflow](#backend-processing-workflow)
-   [API Overview](#api-overview)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
-   [Environment Configuration](#environment-configuration)
-   [Run Locally](#run-locally)
-   [Testing](#testing)
-   [Security Considerations](#security-considerations)
-   [Current Implementation Notes](#current-implementation-notes)
-   [Future Enhancements](#future-enhancements)
-   [Project Team and Academic
    Information](#project-team-and-academic-information)
-   [About Me](#about-me)

------------------------------------------------------------------------

## Project Overview

Traditional corporate contact forms often collect customer details
without providing a structured way to classify enquiries, assign
responsibility, follow up, and monitor outcomes.

The NextGen Corporate Platform addresses this challenge by providing:

-   A corporate website with a customer enquiry form.
-   Backend APIs for validating and storing enquiry information.
-   AI-assisted analysis to identify enquiry category, intent, priority,
    and suggested team.
-   An administrative interface for reviewing and managing enquiries.
-   Enquiry status updates and activity history.
-   Email notification workflow support.
-   An analytics dashboard interface for enquiry-related information.

The platform follows a **save-first processing approach**: the enquiry
is persisted before AI analysis is attempted. This helps retain the
original customer submission even if the external AI service is
unavailable or returns an error.

## Problem Statement

Businesses may receive enquiries through different channels, making it
difficult to:

-   Keep customer and project information organised.
-   Identify urgent or high-priority enquiries.
-   Route enquiries to the appropriate team.
-   Track the current stage of each enquiry.
-   Maintain a history of status changes and follow-up activity.
-   Understand enquiry volume and service demand.

This project provides a centralised application to support these
activities.

## Key Features

### 1. Public Corporate Website

-   Corporate website interface for presenting services.
-   Customer enquiry form for collecting contact and project
    requirements.
-   Form validation before submission.

### 2. Enquiry Management

-   Create and store customer enquiries.
-   Generate a human-readable enquiry reference ID.
-   Maintain enquiry status and timestamps.
-   Retrieve enquiry details using an internal ID or reference ID.
-   Search and filter enquiry records in the administrative interface.

### 3. AI-Assisted Enquiry Analysis

The backend integrates an LLM-based analysis service to process enquiry
text. The generated analysis can include:

-   Enquiry category and subcategory.
-   Customer intent.
-   Priority level.
-   Short enquiry summary.
-   Suggested team.
-   Routing reason.
-   Extracted requirements.
-   Suggested response.

If AI analysis fails, the original enquiry remains stored and the system
records the analysis as failed with fallback information.

### 4. Status Workflow and Activity History

-   Update an enquiry's status.
-   Record the previous and new status.
-   Record the staff member responsible for the update.
-   Maintain an activity timeline for the enquiry.

### 5. Administrative Dashboard

-   View enquiry records and their current status.
-   Search and filter enquiries.
-   View enquiry details, AI analysis, notes, and activity history where
    available.
-   Display enquiry-related summary information and charts in the
    dashboard interface.

### 6. Email Workflow Support

The backend schedules enquiry confirmation emails as a background task.
The project also includes configuration for external email automation
using n8n and Gmail. Actual delivery depends on valid credentials and
correctly configured workflows.

------------------------------------------------------------------------

## Enquiry Lifecycle

A typical enquiry can move through the following stages:

``` text
NEW
  |
  v
CONTACTED
  |
  v
IN_DISCUSSION
  |
  v
PROPOSAL_SENT
  |
  v
CONVERTED
```

An enquiry may also be moved to `CLOSED` when it is no longer active.

The status is updated by an authorised staff member or administrator
through the enquiry management workflow.

## System Architecture

``` text
                 Customer / Admin
                        |
                        v
             Next.js + React Frontend
                        |
                     REST API
                        |
                        v
                 FastAPI Backend
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
    Enquiry Service  AI Service   Email Background
          |          (Groq LLM)   Task / n8n
          |
          v
    Repository Layer
          |
          v
      PostgreSQL
```

**Component responsibilities:**

  -----------------------------------------------------------------------
  Component                           Responsibility
  ----------------------------------- -----------------------------------
  Frontend                            Displays the corporate website,
                                      enquiry form, and administrative
                                      interface

  FastAPI                             Exposes REST endpoints and
                                      processes incoming requests

  Enquiry service                     Implements enquiry processing and
                                      business logic

  Repository layer                    Handles database operations

  PostgreSQL                          Stores enquiry records, AI
                                      analysis, and related activity data

  AI service                          Analyses enquiry text and returns
                                      structured output

  Email workflow                      Supports customer and internal
                                      notifications through configured
                                      integrations
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## Technology Stack

  -----------------------------------------------------------------------
  Layer                   Technology              Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                React, Next.js          Builds the website and
                                                  administrative
                                                  interface

  Styling                 Tailwind CSS            Provides responsive UI
                                                  styling

  Backend                 Python, FastAPI         Implements REST APIs
                                                  and backend logic

  Database                PostgreSQL / Supabase   Stores enquiries and
                                                  related records

  ORM                     SQLAlchemy              Maps Python models to
                                                  database tables

  Data validation         Pydantic                Validates API request
                                                  and response data

  AI / LLM                Groq API, Llama 3.1 8B  Supports enquiry
                          Instant                 analysis

  Analytics               Pandas, Recharts /      Supports data
                          Chart.js                processing and
                                                  visualisation

  Authentication          JWT / role-based access Supports authenticated
                                                  and role-restricted
                                                  operations

  Notifications           Email, n8n, Gmail       Supports enquiry and
                          integration             workflow notifications

  Testing                 Pytest, HTTPX           Supports backend
                                                  testing

  Deployment support      Docker, cloud platform  Supports application
                                                  packaging and
                                                  deployment
  -----------------------------------------------------------------------

> Integration availability depends on the corresponding environment
> variables, credentials, and workflow configuration.

------------------------------------------------------------------------

## My Role and Contributions

### Prasad Annasaheb Nikam --- Backend & AI/ML Developer

As a **Backend & AI/ML Developer**, my work focuses on the backend
enquiry-processing flow and AI-assisted analysis capabilities.

**Key areas of contribution:**

-   **Backend development:** Worked with Python and FastAPI backend
    components supporting enquiry-related operations.
-   **Enquiry processing:** Contributed to the service and repository
    workflow for creating, retrieving, and managing enquiry records.
-   **Save-first processing:** Worked on the flow in which enquiry
    information is stored before the AI analysis step is attempted.
-   **AI integration:** Worked with the Groq LLM integration to analyse
    enquiry text and produce structured information such as category,
    intent, priority, summary, and suggested team.
-   **Failure handling:** Supported fallback handling so an
    AI-processing failure does not discard the original saved enquiry.
-   **Database operations:** Worked with SQLAlchemy-based persistence
    for enquiry data, AI analysis records, and activity events.
-   **Workflow support:** Contributed to backend status-update
    functionality and the recording of status-change activity.

**Technologies used in my contribution:** Python, FastAPI, SQLAlchemy,
PostgreSQL, Groq API, and LLM-assisted processing.

------------------------------------------------------------------------

## Backend Processing Workflow

### 1. Enquiry Submission

1.  A customer fills in the public enquiry form.
2.  The frontend submits the enquiry to the backend.
3.  FastAPI receives and validates the request.
4.  The backend generates a human-readable reference ID.
5.  The enquiry is saved with the initial status `NEW`.
6.  An `ENQUIRY_CREATED` activity event is recorded.

### 2. AI Analysis

After the enquiry is saved, the enquiry-processing service calls the AI
analysis component.

**When analysis succeeds:** - The generated analysis is stored. -
Relevant enquiry fields such as category, priority, and assigned team
are updated.

**When analysis fails:** - The original enquiry remains stored. - A
failed analysis record and fallback information are saved.

**Implementation detail:** AI analysis currently runs synchronously in
the enquiry-processing service. The email confirmation task is scheduled
separately as a background task.

### 3. Status Update

1.  An authorised staff member or administrator selects a new status.
2.  The backend retrieves the enquiry.
3.  The enquiry status and update timestamp are changed.
4.  If the status is `CLOSED` or `CONVERTED`, the closed timestamp is
    set.
5.  A status-change activity event is recorded with the previous status,
    new status, and actor ID.

The status update and activity-event insertion are separate database
commits in the current implementation.

------------------------------------------------------------------------

## API Overview

The following are the main enquiry endpoints identified in the backend
router.

  --------------------------------------------------------------------------------------------------
  Method            Endpoint                                     Access            Purpose
  ----------------- -------------------------------------------- ----------------- -----------------
  `POST`            `/api/v1/enquiries`                          Public            Submit a new
                                                                                   enquiry

  `GET`             `/api/v1/enquiries`                          Staff / Admin     Retrieve enquiry
                                                                                   records with
                                                                                   supported filters
                                                                                   and pagination

  `GET`             `/api/v1/enquiries/{id}`                     Staff / Admin     Retrieve an
                                                                                   enquiry by
                                                                                   internal ID or
                                                                                   reference ID

  `PATCH`           `/api/v1/enquiries/{id}/status`              Staff / Admin     Update an
                                                                                   enquiry's status

  `POST`            `/api/v1/enquiries/{id}/status-with-email`   Staff / Admin     Update status and
                                                                                   optionally queue
                                                                                   a stage email
  --------------------------------------------------------------------------------------------------

The backend also contains service/repository functionality for AI
reanalysis, assignment, and internal notes. Refer to the current API
router and schemas for the exact routes and request formats.

Interactive API documentation is available through FastAPI:

``` text
http://localhost:8000/docs
```

------------------------------------------------------------------------

## Project Structure

The following is a simplified view of the repository structure. Exact
filenames may vary with the current repository version.

``` text
nextgen-corporate-platform/
|
├── src/
│   └── app/
│       └── admin/
│           └── enquiries/
│               ├── page.tsx
│               └── [id]/
│                   └── page.tsx
|
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── repositories/
│   ├── requirements.txt
│   └── alembic/
|
├── package.json
└── README.md
```

------------------------------------------------------------------------

## Getting Started

### Prerequisites

Install the following tools:

-   Git
-   Node.js and npm
-   Python 3.10 or later
-   PostgreSQL database or Supabase PostgreSQL project
-   Groq API key if AI analysis is to be enabled
-   n8n and Gmail credentials if email automation is to be enabled

### 1. Clone the Repository

``` bash
git clone https://github.com/PrajwalChopade/nextgen-corporate-platform.git
cd nextgen-corporate-platform
```

### 2. Configure the Backend

``` bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell:**

``` powershell
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux:**

``` bash
source .venv/bin/activate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

Create `backend/.env` using the configuration template below and the
variable names required by the project's settings module.

### 3. Configure the Frontend

From the project root:

``` bash
npm install
```

Create `.env.local` in the project root and add the frontend variables
required by the application.

### 4. Run Database Migrations

From the backend directory:

``` bash
alembic upgrade head
```

This applies the available Alembic migrations to the configured
database.

------------------------------------------------------------------------

## Environment Configuration

**Never commit real credentials, API keys, database passwords, JWT
secrets, or webhook URLs to GitHub.**

### Frontend `.env.local`

``` env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Backend `backend/.env`

``` env
ENVIRONMENT=development
DEBUG=True
API_V1_PREFIX=/api/v1
PROJECT_NAME=NextGen Corporate Platform - Enquiry Management API

CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

DATABASE_URL=your-postgresql-connection-string

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
SUPABASE_JWT_ALGORITHM=HS256

LLM_PROVIDER=groq
LLM_API_KEY=your-groq-api-key
LLM_MODEL=llama-3.1-8b-instant
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_TIMEOUT_SECONDS=25

N8N_EMAIL_WEBHOOK_URL=your-n8n-stage-email-webhook
N8N_ENQUIRY_CONFIRMATION_WEBHOOK_URL=your-n8n-enquiry-confirmation-webhook
N8N_WEBHOOK_SECRET=your-n8n-webhook-secret

ADMIN_NOTIFICATION_EMAIL=your-admin-email@example.com
```

> This is a configuration template, not a guarantee that every variable
> is required in every environment. Confirm names and required values
> against the current backend settings and frontend code.

------------------------------------------------------------------------

## Run Locally

### Start the Backend

From the `backend` directory, with the virtual environment activated:

``` bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend: `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

### Start the Frontend

Open another terminal in the project root:

``` bash
npm run dev
```

Frontend: `http://localhost:3000`

------------------------------------------------------------------------

## Testing

### Backend Tests

From the backend directory, activate the virtual environment and run:

``` bash
pytest -v
```

### Frontend Type Checking and Build

From the project root:

``` bash
npx tsc --noEmit
npm run build
```

Run these commands in the current project environment to verify
dependencies, configuration, and code.

------------------------------------------------------------------------

## Security Considerations

-   Keep `.env` and `.env.local` out of version control.
-   Use role-based access checks for staff and administrator endpoints.
-   Validate incoming request data on the backend.
-   Treat customer-provided enquiry text as untrusted input when sending
    it to an LLM.
-   Protect webhook endpoints with appropriate secret validation.
-   Do not expose service-role keys or private credentials in frontend
    code.

------------------------------------------------------------------------

## Current Implementation Notes

This repository represents an academic project prototype. The following
details are important when describing the current implementation:

-   The enquiry is saved before AI analysis, but AI analysis currently
    runs synchronously in the enquiry-processing request.
-   Email confirmation is scheduled as a background task; actual
    delivery depends on the configured email integration.
-   The enquiry-list frontend currently performs search, filtering,
    sorting, and pagination on the data available in its React context.
    Do not assume every displayed list operation is server-side.
-   The backend provides list filtering and pagination capabilities, but
    the actual frontend-to-backend integration should be verified in the
    current application configuration.
-   A honeypot field is checked by the service, but the current service
    code still saves the enquiry when that field is populated. It should
    not be described as a fully enforced spam-rejection mechanism.
-   Status changes and their activity events are committed separately.
    They are not currently one atomic database transaction.
-   Describe dashboard metrics as live database analytics only after the
    relevant frontend and analytics API integration has been verified.

These notes keep the documentation aligned with the implementation
rather than claiming unverified production guarantees.

## Future Enhancements

-   Move AI analysis to a dedicated background job queue.
-   Make status updates and audit-event creation atomic.
-   Enforce honeypot handling or add another appropriate anti-spam
    mechanism.
-   Complete and verify frontend integration with backend list and
    analytics APIs.
-   Add comprehensive automated tests and measured performance
    benchmarks.
-   Improve notification delivery monitoring and retry handling.
-   Add deployment documentation for the selected hosting platform.

------------------------------------------------------------------------

## Project Team and Academic Information

**Project:** NextGen Corporate Platform -- AI-Powered Corporate Website
and Automated Enquiry Management System

**Institution:** Vishwakarma Institute of Information Technology (VIIT),
Pune

**Programme:** Bachelor of Technology (B.Tech)

**Project Type:** Final Year Major Project

**Repository:**
[nextgen-corporate-platform](https://github.com/PrajwalChopade/nextgen-corporate-platform)

**Project Lead / Developer:** Prajwal Chopade

**Backend & AI/ML Developer:** Prasad Annasaheb Nikam

------------------------------------------------------------------------

## About Me

### Prasad Annasaheb Nikam

**Backend & AI/ML Developer \| CSE (Artificial Intelligence & Machine
Learning)**

I am a B.Tech Computer Science and Engineering student specialising in
Artificial Intelligence and Machine Learning at Vishwakarma Institute of
Information Technology (VIIT), Pune.

I am interested in backend development, data science, machine learning,
and building practical AI-powered applications.

**Education** - B.Tech -- Computer Science and Engineering (AI & ML) -
Vishwakarma Institute of Information Technology (VIIT), Pune - CGPA:
9.54 / 10

**Technical Skills** - **Programming:** Python, SQL, Java (Basic) -
**Backend & APIs:** FastAPI - **Database:** PostgreSQL, MySQL - **Data &
Machine Learning:** Pandas, NumPy, Scikit-learn - **Visualisation:**
Matplotlib, Seaborn, Power BI - **Tools:** Git, Streamlit

**Project Focus** - Backend application development - REST API design
and implementation - Database-driven application workflows - AI/LLM
integration - Machine learning and data analysis

------------------------------------------------------------------------

*Developed as an academic major project to demonstrate full-stack web
development, backend API design, database-driven enquiry management,
AI-assisted analysis, and workflow automation.*
