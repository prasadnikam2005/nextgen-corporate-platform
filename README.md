# NextGen Corporate Platform

### AI-Powered Corporate Website & Automated Enquiry Management System

A full-stack corporate platform for capturing customer enquiries,
analysing them with an LLM, and managing their progress through a
structured enquiry lifecycle.

The platform brings together a public corporate website, an
enquiry-processing backend, AI-assisted triage, an administrative
enquiry workflow, and notification support.

**Core engineering idea:** preserve the customer's enquiry first, then
perform AI-assisted analysis. This save-first design helps prevent an
external AI failure from causing the original enquiry to be lost.

------------------------------------------------------------------------

## Project at a Glance

  ------------------------------------------------------------------------------------------------------------------------------------------------------------
  Item                                Details
  ----------------------------------- ------------------------------------------------------------------------------------------------------------------------
  Project                             NextGen Corporate Platform

  Project type                        Final Year B.Tech Major Project

  Domain                              Full-Stack Web Development, Backend Engineering, AI/LLM Integration

  My role                             **Backend & AI/ML Developer**

  Institution                         Vishwakarma Institute of Information Technology (VITk), Pune

  Repository                          [github.com/prasadnikam2005/nextgen-corporate-platform](https://github.com/prasadnikam2005/nextgen-corporate-platform)
  ------------------------------------------------------------------------------------------------------------------------------------------------------------

## Contents

-   [Overview](#overview)
-   [Problem Statement](#problem-statement)
-   [Objectives](#project-objectives)
-   [Features](#key-features)
-   [Enquiry Lifecycle](#enquiry-lifecycle)
-   [Architecture](#system-architecture)
-   [Technology Stack](#technology-stack)
-   [My Role and Contributions](#my-role-and-contributions)
-   [Backend Design Details](#backend-design-details)
-   [API Reference](#api-reference)
-   [Data Model](#data-model-overview)
-   [Repository Structure](#repository-structure)
-   [Local Setup](#local-setup)
-   [Environment Variables](#environment-variables)
-   [Testing and Verification](#testing-and-verification)
-   [Security and Reliability](#security-and-reliability-considerations)
-   [Known Implementation Notes](#known-implementation-notes)
-   [Future Improvements](#future-improvements)
-   [About the Developer](#about-the-developer)

------------------------------------------------------------------------

## Overview

A basic contact form can collect a customer's name, email address, and
message, but it does not by itself provide a reliable process for
understanding, prioritising, assigning, and following up on that
enquiry.

The NextGen Corporate Platform is designed to make that process more
organised. A customer submits an enquiry through the corporate website.
The backend validates and stores the submission, generates a reference
ID, and requests AI-assisted analysis. Staff can then review the
enquiry, inspect its analysis, and update its status as the conversation
progresses.

The platform is intended to support the complete enquiry-handling
process:

1.  **Capture** customer and project requirements.
2.  **Persist** the enquiry and generate a trackable reference.
3.  **Analyse** the enquiry using an LLM-assisted service.
4.  **Review** the enquiry and its analysis in the admin interface.
5.  **Manage** the enquiry through status updates and activity tracking.
6.  **Communicate** through configured email workflows.
7.  **Monitor** enquiry information through dashboard views.

## Problem Statement

In a typical corporate enquiry process, customer requests may be handled
through shared inboxes, spreadsheets, or disconnected forms. This can
create operational problems:

-   Customer enquiries may be difficult to track after submission.
-   Staff may need to read every message manually before deciding its
    category or urgency.
-   Enquiries may not reach the most relevant team quickly.
-   The current status and follow-up history may not be clear.
-   External service failures can interrupt workflows if data
    persistence depends on those services.
-   Managers may lack a central view of enquiry activity.

The project addresses these problems through a centralised enquiry
platform with database-backed records, AI-assisted triage, status
management, and supporting dashboard and notification features.

## Project Objectives

-   Build a corporate website with a structured enquiry submission
    experience.
-   Provide backend APIs for enquiry creation and administration.
-   Store customer enquiries with a unique, human-readable reference ID.
-   Use an LLM to assist with enquiry classification, prioritisation,
    summarisation, and team suggestions.
-   Preserve enquiry data when AI analysis fails.
-   Support controlled status updates and an activity history.
-   Provide a central administrative interface for enquiry review.
-   Support email notification workflows through background processing
    and external automation configuration.

------------------------------------------------------------------------

## Key Features

### 1. Public Corporate Website and Enquiry Form

The public-facing website presents the organisation's services and
provides a form for prospective customers to submit their requirements.

The enquiry data model supports information such as:

-   Customer name and email address.
-   Phone number and company name, when provided.
-   Enquiry subject and message.
-   Service interest.

The backend validates the submitted request before processing it.

### 2. Reference-Based Enquiry Records

Each enquiry receives a human-readable reference in the format:

``` text
ENQ-YYYY-XXXXX
```

The reference makes an enquiry easier to identify in administrative
conversations and records. The database also maintains an internal
UUID-based record ID. The reference ID and internal database ID serve
different purposes.

### 3. AI-Assisted Enquiry Triage

The AI service analyses the customer's message and can return structured
information such as:

-   **Category and subcategory:** the type of service or requirement.
-   **Intent:** what the customer is trying to achieve.
-   **Priority:** LOW, MEDIUM, HIGH, or CRITICAL.
-   **Summary:** a concise description for staff review.
-   **Suggested team:** a recommended team for handling the enquiry.
-   **Routing reason:** why that team may be appropriate.
-   **Extracted requirements:** important details identified in the
    message.
-   **Suggested response:** a draft response to help staff continue the
    conversation.

AI output supports staff decision-making; it does not replace human
review.

### 4. Save-First Processing and Failure Handling

The backend creates the enquiry record before calling the AI analysis
service.

``` text
Customer submits enquiry
          |
          v
Validate request
          |
          v
Save enquiry in database
          |
          v
Attempt AI analysis
       /       \
      /         \
 Success       Failure
   |              |
   v              v
Save AI result   Save failed-analysis
                 state and fallback
      \           /
       \         /
        v       v
   Return saved enquiry
```

If the AI service fails, the original enquiry remains in the database.
The backend records the analysis outcome as failed and stores fallback
information, allowing the enquiry to remain available for staff
handling.

### 5. Enquiry Status Management

The administrative workflow supports status updates as staff progress an
enquiry.

The implemented status values include:

-   `NEW`
-   `CONTACTED`
-   `IN_DISCUSSION`
-   `PROPOSAL_SENT`
-   `CONVERTED`
-   `CLOSED`

A status update changes the enquiry's current status and records an
activity event containing the previous status, new status, and actor ID.

### 6. Enquiry Details and Activity History

The enquiry detail response can include related information such as:

-   Enquiry data.
-   Latest AI analysis.
-   Internal notes.
-   Activity events.

This gives staff a consolidated view of the enquiry and its recorded
history.

### 7. Email Notification Support

The public enquiry endpoint schedules a confirmation-email task
separately from the main service call. The project also contains
configuration for n8n webhook workflows and Gmail-based email delivery.

Actual email delivery requires valid credentials, reachable webhook
endpoints, and correctly configured external workflows.

### 8. Administrative Enquiry Interface

The admin interface provides enquiry list and detail views. The list
page includes search, filtering, sorting, pagination over the data held
in its React context, and CSV export functionality. The detail page
provides access to enquiry information and workflow actions such as
status handling, assignment, notes, and AI reanalysis where supported by
the interface.

------------------------------------------------------------------------

## Enquiry Lifecycle

A typical enquiry progresses through the following stages:

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

       An enquiry may also be moved to CLOSED.
```

**Example scenario**

A customer submits a request for an AI chatbot solution.

1.  The enquiry is created with status `NEW`.
2.  A staff member contacts the customer and changes the status to
    `CONTACTED`.
3.  The requirements, budget, and timeline are discussed under
    `IN_DISCUSSION`.
4.  The company sends a proposal and updates the status to
    `PROPOSAL_SENT`.
5.  If the customer accepts, the enquiry is marked `CONVERTED`.
6.  If the enquiry is no longer active, it can be marked `CLOSED`.

------------------------------------------------------------------------

## System Architecture

``` text
                    CUSTOMER / STAFF
                           |
                           v
                NEXT.JS + REACT FRONTEND
                 Public Site / Admin UI
                           |
                      HTTP REST API
                           |
                           v
                    PYTHON FASTAPI
                           |
                  ENQUIRY SERVICE LAYER
                           |
              +------------+-------------+
              |            |             |
              v            v             v
        REPOSITORY     AI SERVICE    BACKGROUND
          LAYER        GROQ LLM      EMAIL TASK
              |                          |
              v                          v
         POSTGRESQL                  n8n WEBHOOK
              |                          |
              v                          v
      ENQUIRY / ANALYSIS             GMAIL API
      EVENTS / NOTES
```

### Architecture responsibilities

  -----------------------------------------------------------------------
  Layer                               Responsibility
  ----------------------------------- -----------------------------------
  Next.js / React frontend            Renders the public website and
                                      admin interface; collects user
                                      input and displays enquiry data

  FastAPI router                      Defines HTTP endpoints, applies
                                      access dependencies, and connects
                                      requests to service logic

  Enquiry service                     Coordinates enquiry creation, AI
                                      analysis, fallback handling, and
                                      reanalysis

  Repository layer                    Performs database reads and writes

  SQLAlchemy models                   Represent enquiry records and
                                      related entities

  PostgreSQL                          Persists enquiries, AI analysis
                                      records, events, notes, and related
                                      data

  AI service                          Calls the configured LLM and
                                      converts the response into
                                      structured analysis

  Background email task / n8n         Supports email notification and
                                      stage-email workflows
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## Technology Stack

  -----------------------------------------------------------------------
  Area                    Technology              Use in the project
  ----------------------- ----------------------- -----------------------
  Frontend framework      Next.js                 Application framework
                                                  and routing

  UI library              React                   Interactive user
                                                  interface and component
                                                  state

  Styling                 Tailwind CSS            Utility-based
                                                  responsive styling

  Backend language        Python                  Backend implementation
                                                  and AI service
                                                  integration

  API framework           FastAPI                 REST API endpoints and
                                                  request handling

  Request / response      Pydantic                Data validation and
  validation                                      schema handling

  ORM                     SQLAlchemy              Relational database
                                                  mapping and queries

  Database                PostgreSQL / Supabase   Persistent storage for
                                                  enquiry-related records

  AI inference            Groq API                LLM inference for
                                                  enquiry analysis

  LLM model               Llama 3.1 8B Instant    Enquiry classification
                                                  and structured text
                                                  analysis

  Email automation        n8n                     External workflow
                                                  orchestration through
                                                  webhooks

  Email provider          Gmail API / OAuth2      Email delivery in the
                                                  configured workflow

  Testing                 Pytest, HTTPX           Backend test and API
                                                  test support

  Version control         Git, GitHub             Source control and
                                                  project collaboration
  -----------------------------------------------------------------------

> **Note:** The table describes technologies identified in the project
> documentation and implementation context. A technology should be
> considered active in a deployment only when its integration is
> configured and used by that deployment.

------------------------------------------------------------------------

## My Role and Contributions

### Prasad Annasaheb Nikam

**Backend & AI/ML Developer**

My assigned role in this project is **Backend & AI/ML Developer**. My
contribution is focused on the backend enquiry-processing workflow,
database-backed operations, and AI-assisted enquiry analysis.

#### Backend development

-   Worked with the Python and FastAPI backend structure.
-   Contributed to enquiry service and repository operations.
-   Worked on enquiry creation, retrieval, and status-management logic.
-   Worked with request schemas and database-backed processing.

#### AI/LLM integration

-   Worked with the Groq API integration for LLM-assisted enquiry
    analysis.
-   Worked on the analysis flow for category, subcategory, intent,
    priority, summary, team suggestion, extracted requirements, and
    suggested response.
-   Worked with structured AI output so the analysis can be stored and
    presented to the administrative workflow.

#### Reliability and data handling

-   Contributed to the save-first enquiry-processing approach.
-   Worked on failure handling that preserves the original enquiry if AI
    analysis fails.
-   Worked with the persistence of AI analysis outcomes and enquiry
    activity events.

#### Database and workflow operations

-   Worked with SQLAlchemy-based persistence and PostgreSQL-backed
    enquiry data.
-   Contributed to status-update operations and status-change activity
    recording.
-   Worked with the relationship between enquiry records, AI analysis,
    and event history.

**Primary technologies in my role:** Python, FastAPI, SQLAlchemy,
PostgreSQL, Groq API, and LLM integration.

------------------------------------------------------------------------

## Backend Design Details

### 1. Enquiry Creation

The public endpoint is:

``` http
POST /api/v1/enquiries
```

The request is validated against the enquiry creation schema. The
service then coordinates persistence and AI analysis.

At the repository level, enquiry creation includes:

-   Generating a reference ID.
-   Creating the enquiry with initial status `NEW`.
-   Setting the source to `WEB_PORTAL`.
-   Committing and refreshing the record.
-   Recording an `ENQUIRY_CREATED` event.

### 2. AI Analysis Persistence

When AI analysis succeeds, the backend stores an AI analysis record
containing the provider/model information and the structured analysis
output. The enquiry's category, priority, and assigned-team information
are updated from the analysis result.

When AI analysis fails, the backend records a failed analysis state and
fallback information. The enquiry record itself remains saved.

### 3. Status Update and Audit Event

The status endpoint is:

``` http
PATCH /api/v1/enquiries/{id}/status
```

The repository operation:

1.  Reads the existing status.
2.  Updates the enquiry's status and `updated_at` timestamp.
3.  Sets `closed_at` when the new status is `CLOSED` or `CONVERTED`.
4.  Commits and refreshes the enquiry.
5.  Records a `STATUS_CHANGED` event with the old status, new status,
    and actor ID.

**Transaction detail:** the status update and event insertion are
separate commits in the current implementation. They should not be
described as a single atomic transaction.

### 4. Enquiry Lookup

The backend can retrieve an enquiry by its internal UUID or its
human-readable reference ID. The detail retrieval also loads related AI
analyses, events, and notes.

------------------------------------------------------------------------

## API Reference

The following endpoints are present in the enquiry router.

  --------------------------------------------------------------------------------------------------
  Method            Endpoint                                     Access            Description
  ----------------- -------------------------------------------- ----------------- -----------------
  `POST`            `/api/v1/enquiries`                          Public            Submit a new
                                                                                   enquiry

  `GET`             `/api/v1/enquiries`                          Staff / Admin     List enquiries
                                                                                   with supported
                                                                                   filters and
                                                                                   pagination

  `GET`             `/api/v1/enquiries/{id}`                     Staff / Admin     Retrieve an
                                                                                   enquiry by ID or
                                                                                   reference ID

  `PATCH`           `/api/v1/enquiries/{id}/status`              Staff / Admin     Update the
                                                                                   enquiry status

  `POST`            `/api/v1/enquiries/{id}/status-with-email`   Staff / Admin     Update status and
                                                                                   optionally queue
                                                                                   a stage email
  --------------------------------------------------------------------------------------------------

The backend also contains service/repository functionality for AI
reanalysis, assignment, and internal notes. Refer to the current router
and schemas for the exact routes and request formats.

FastAPI interactive API documentation (when the backend is running):

``` text
http://localhost:8000/docs
```

------------------------------------------------------------------------

## Data Model Overview

The main `Enquiry` record includes fields such as:

  Field                Purpose
  -------------------- ---------------------------------------------------
  `id`                 Internal UUID-based primary key
  `reference_id`       Human-readable unique enquiry reference
  `full_name`          Customer name
  `email`              Customer email address
  `phone`              Optional contact number
  `company_name`       Optional company name
  `subject`            Optional enquiry subject
  `message`            Customer's enquiry message
  `service_interest`   Optional service selected by the customer
  `status`             Current enquiry workflow status
  `priority`           AI-assisted or operational priority
  `category`           Enquiry category
  `assigned_team`      Suggested or assigned team
  `assigned_to`        Optional staff profile reference
  `source`             Enquiry source, defaulting to `WEB_PORTAL`
  `created_at`         Creation timestamp
  `updated_at`         Last update timestamp
  `closed_at`          Timestamp set when marked `CLOSED` or `CONVERTED`

Related records include AI analysis, enquiry events, notes, and email
records.

------------------------------------------------------------------------

## Repository Structure

The repository contains a Next.js frontend and a Python backend. The
following is a simplified view of the known structure; consult the
repository for the complete current file tree.

``` text
nextgen-corporate-platform/
│
├── src/
│   └── app/
│       └── admin/
│           └── enquiries/
│               ├── page.tsx
│               └── [id]/
│                   └── page.tsx
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── repositories/
│   ├── alembic/
│   └── requirements.txt
│
├── package.json
└── README.md
```

------------------------------------------------------------------------

## Local Setup

### Prerequisites

-   Git
-   Node.js and npm
-   Python 3.10 or later
-   PostgreSQL database or a Supabase PostgreSQL project
-   Groq API key for AI analysis
-   n8n and Gmail credentials if email automation is required

### 1. Clone the repository

``` bash
git clone https://github.com/prasadnikam2005/nextgen-corporate-platform.git
cd nextgen-corporate-platform
```

### 2. Set up the backend

``` bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell**

``` powershell
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux**

``` bash
source .venv/bin/activate
```

Install backend dependencies:

``` bash
pip install -r requirements.txt
```

### 3. Configure the environment

Create the backend `.env` file and frontend `.env.local` file using the
templates in the next section. Use the exact variable names expected by
the current settings and frontend code.

### 4. Apply database migrations

From the backend directory:

``` bash
alembic upgrade head
```

This applies the available Alembic migrations to the configured
database.

------------------------------------------------------------------------

## Environment Variables

Never commit real credentials, API keys, database passwords, JWT
secrets, or private webhook URLs to GitHub.

### Frontend: `.env.local`

``` env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Backend: `backend/.env`

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

> These are example placeholders based on the project configuration
> previously documented. Confirm each variable against the current
> settings code before running the application.

------------------------------------------------------------------------

## Run Locally

### Start the backend

From the `backend` directory, with the virtual environment activated:

``` bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend base URL:

``` text
http://localhost:8000
```

API documentation:

``` text
http://localhost:8000/docs
```

### Start the frontend

Open a second terminal at the repository root:

``` bash
npm install
npm run dev
```

Frontend:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

## Testing and Verification

### Backend tests

From the backend directory, activate the virtual environment and run:

``` bash
pytest -v
```

### Frontend type checking

From the repository root:

``` bash
npx tsc --noEmit
```

### Production build check

``` bash
npm run build
```

Run these commands in the current development environment to verify the
installed dependencies, configuration, and code. Do not report test
coverage or performance figures unless they have been measured and
verified.

------------------------------------------------------------------------

## Security and Reliability Considerations

-   **Input validation:** Validate incoming enquiry data on the backend.
-   **Access control:** Protect staff and administrator endpoints with
    the appropriate authentication and role checks.
-   **Credential management:** Keep secrets in environment variables and
    out of source control.
-   **LLM input handling:** Treat customer enquiry text as untrusted
    input when sending it to an LLM.
-   **Save-first persistence:** Store the original enquiry before
    attempting external AI analysis.
-   **Failure handling:** Record AI analysis failure separately from the
    original enquiry record.
-   **Webhook protection:** Configure and validate secrets for external
    webhook integrations.

------------------------------------------------------------------------

## Known Implementation Notes

This README describes the implementation details available from the
project code and documentation reviewed for this project. These
distinctions are important:

1.  **AI execution:** AI analysis currently runs synchronously inside
    the enquiry-processing service. The email confirmation task is
    scheduled separately as a background task.
2.  **Honeypot handling:** The service checks the honeypot field, but
    the current code path still creates the enquiry when the field is
    populated. Therefore, it should not be described as a fully enforced
    spam-rejection mechanism.
3.  **Status event transaction:** The enquiry status update and the
    activity-event insertion are separate database commits, not one
    atomic transaction.
4.  **Frontend list behaviour:** The current enquiry list page performs
    search, filtering, sorting, and pagination over the data available
    in its React context. The backend also exposes list filtering and
    pagination, but the frontend's complete connection to those backend
    capabilities should be verified in the current application.
5.  **Email delivery:** Email delivery depends on valid environment
    configuration and functioning external n8n/Gmail workflows.
6.  **Analytics claims:** Describe dashboard values as live database
    analytics only where the relevant API and frontend integration has
    been verified.

These notes are intentional: the README should document what the project
actually implements rather than claim unverified production guarantees.

## Future Improvements

-   Move AI analysis to a dedicated background job queue to reduce
    request latency.
-   Make status updates and audit-event creation atomic.
-   Enforce honeypot rejection or introduce an appropriate anti-spam
    strategy.
-   Verify and complete frontend integration with backend list and
    analytics APIs.
-   Add retry handling and delivery-status monitoring for email
    workflows.
-   Expand automated tests for enquiry processing, AI failure cases,
    permissions, and status transitions.
-   Add deployment instructions for the actual hosting environment.
-   Add measured performance benchmarks after running repeatable tests.

------------------------------------------------------------------------

## Academic Information

  -------------------------------------------------------------------------------------------------------------------------------------------------
  Field                               Details
  ----------------------------------- -------------------------------------------------------------------------------------------------------------
  Project title                       NextGen Corporate Platform -- AI-Powered Corporate Website and Automated Enquiry Management System

  Institution                         Vishwakarma Institute of Information Technology (VITk), Pune

  Degree                              Bachelor of Technology (B.Tech)

  Branch                              Computer Science and Engineering -- Artificial Intelligence & Machine Learning

  Project type                        Final Year Major Project

  My project role                     Backend & AI/ML Developer

  GitHub repository                   [prasadnikam2005/nextgen-corporate-platform](https://github.com/prasadnikam2005/nextgen-corporate-platform)
  -------------------------------------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## About the Developer

### Prasad Annasaheb Nikam

**Backend & AI/ML Developer \| B.Tech CSE (AI & ML)**

I am a Computer Science and Engineering student specialising in
Artificial Intelligence and Machine Learning at Vishwakarma Institute of
Information Technology (VITk), Pune. I am interested in backend
engineering, data science, machine learning, and building practical
AI-powered applications.

**Education** - B.Tech, Computer Science and Engineering (AI & ML) -
Vishwakarma Institute of Information Technology (VITk), Pune - CGPA:
**9.54 / 10**

**Technical Skills** - **Programming:** Python, SQL, Java (Basic) -
**Backend and APIs:** FastAPI - **Databases:** PostgreSQL, MySQL -
**Data and Machine Learning:** Pandas, NumPy, Scikit-learn -
**Visualisation:** Matplotlib, Seaborn, Power BI - **Tools:** Git,
Streamlit

**Areas of Interest** - Backend development and REST API design -
Database-driven application development - AI and LLM integration -
Machine learning and data analysis

**GitHub:**
[github.com/prasadnikam2005](https://github.com/prasadnikam2005)

------------------------------------------------------------------------

*This project was developed as an academic major project to demonstrate
full-stack application development, backend API engineering, relational
data management, AI-assisted enquiry analysis, and workflow automation.*
