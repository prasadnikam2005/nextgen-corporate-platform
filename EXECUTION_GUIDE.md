# NextGen Corporate Platform — End-to-End Execution Guide

A comprehensive, step-by-step operational manual for running, testing, demonstrating, and managing the **Nexora Enterprise Corporate Platform**.

---

## 📋 Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [Environment Configuration](#3-environment-configuration)
4. [Database Setup & Alembic Migrations](#4-database-setup--alembic-migrations)
5. [Starting the Application (Step-by-Step)](#5-starting-the-application-step-by-step)
6. [n8n Email Automation Setup](#6-n8n-email-automation-setup)
7. [Complete End-to-End Demonstration Walkthrough](#7-complete-end-to-end-demonstration-walkthrough)
8. [Automated Testing & Verification](#8-automated-testing--verification)
9. [Troubleshooting & FAQs](#9-troubleshooting--faqs)

---

## 1. System Architecture Overview

The platform is composed of 5 decoupled, enterprise-grade components:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js 15 Client                               │
│  - Public Portal: High-converting landing & contact forms (port 3000)  │
│  - Admin Portal: CRM, Kanban, Analytics, AI Triage, Corner Widget      │
└───────────────────▲────────────────────────────────────▲───────────────┘
                    │ REST API                           │ Supabase Auth
                    ▼                                    ▼
┌───────────────────────────────────────┐    ┌───────────────────────────┐
│        FastAPI Backend (port 8000)     │    │   Supabase Auth & JWT     │
│  - Save-First Enquiry Lifecycle Engine│    │   Role-Based Authorization│
│  - Groq LLM Prompt Pipeline           │    └───────────────────────────┘
│  - Real-time DB Analytics Aggregation │
└───────────────▲───────────────────────┘
                │
        ┌───────┴───────────────────────┐
        ▼                               ▼
┌───────────────────────────────┐ ┌──────────────────────────────────────┐
│  PostgreSQL (Supabase Cloud)  │ │      n8n Automation Engine           │
│  - enquiries                  │ │  - Webhook Trigger                   │
│  - enquiry_ai_analyses        │ │  - HTML Email Formatter              │
│  - enquiry_emails             │ │  - Client Dispatch (Gmail / SMTP)    │
│  - enquiry_events & notes     │ │  - Delivery Status Webhook Callback  │
└───────────────────────────────┘ └──────────────────────────────────────┘
```

---

## 2. Prerequisites

Ensure the following tools are installed on your machine:

- **Node.js**: `v18.18+` or `v20+` (verify via `node -v`)
- **npm**: `v9+` or `v10+` (verify via `npm -v`)
- **Python**: `3.10+` or `3.11+` (verify via `python --version`)
- **Git** (optional for version control)
- **n8n Instance**: Either [n8n Cloud](https://n8n.io) or self-hosted n8n (`npx n8n`)

---

## 3. Environment Configuration

The application requires two configuration files: one for the frontend and one for the backend.

### 3.1 Frontend Configuration (`.env` in project root)
Ensure the file `d:\VIIT\7th\Majoor Project\.env` exists:

```env
# ==========================================
# NextGen Corporate Platform - Frontend
# ==========================================

# Base URL pointing to the FastAPI Backend
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"

# Supabase Public Configuration (Safe for Browser)
NEXT_PUBLIC_SUPABASE_URL="https://tzptelounqgcnrdgtneq.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

### 3.2 Backend Configuration (`backend/.env`)
Ensure `d:\VIIT\7th\Majoor Project\backend\.env` contains:

```env
# ==========================================
# NextGen Corporate Platform - Backend
# ==========================================

ENVIRONMENT=development
DEBUG=True
API_V1_PREFIX=/api/v1
PROJECT_NAME="NextGen Corporate Platform - Enquiry Management API"

# Allowed CORS Origins
CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"

# PostgreSQL Database (Supabase Cloud)
DATABASE_URL="your_database_connection_string"

# Supabase Auth
SUPABASE_URL="https://tzptelounqgcnrdgtneq.supabase.co"
SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
SUPABASE_JWT_SECRET="your_jwt_secret"
SUPABASE_JWT_ALGORITHM="HS256"

# Groq LLM AI Triage & Draft Generator
LLM_PROVIDER="groq"
LLM_API_KEY=your_groq_api_key_here
LLM_MODEL="openai/gpt-oss-20b"
LLM_BASE_URL="https://api.groq.com/openai/v1"
LLM_TIMEOUT_SECONDS=25
LLM_MAX_RETRIES=2

# n8n Automated Email Webhook
N8N_EMAIL_WEBHOOK_URL="https://aemnexora.app.n8n.cloud/webhook/nexora-stage-email"
N8N_WEBHOOK_SECRET="your_webhook_secret"
```

---

## 4. Database Setup & Alembic Migrations

The database runs on Supabase PostgreSQL. Tables are automatically tracked and versioned using Alembic.

To run migrations:

```powershell
# In a PowerShell terminal:
cd "d:\VIIT\7th\Majoor Project\backend"

# Activate the virtual environment
.\.venv\Scripts\Activate.ps1

# Apply all database schema revisions
alembic upgrade head
```

> **Tables verified in PostgreSQL:**
> - `enquiries` (primary enquiries table with reference IDs `ENQ-2026-XXXXX`)
> - `enquiry_ai_analyses` (Groq categorization, intent, confidence, suggested team)
> - `enquiry_emails` (all stage transition email copies, status: `SENT`, `DELIVERED`, `REPLIED`)
> - `enquiry_events` (immutable audit timeline)
> - `enquiry_notes` (internal team collaboration notes)
> - `profiles` (system users and RBAC roles `ADMIN`, `STAFF`)

---

## 5. Starting the Application (Step-by-Step)

To run the entire system locally, open **three terminal tabs**:

### Terminal 1: FastAPI Backend
```powershell
cd "d:\VIIT\7th\Majoor Project\backend"
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- **Backend API URL**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **Health Check**: `http://127.0.0.1:8000/api/v1/health`

### Terminal 2: Next.js Frontend
```powershell
cd "d:\VIIT\7th\Majoor Project"
npm run dev
```
- **Web App URL**: `http://localhost:3000`
- **Admin Portal**: `http://localhost:3000/admin/dashboard`
- **Enquiries Manager**: `http://localhost:3000/admin/enquiries`

### Terminal 3: Public Tunnel (for n8n Cloud Callback)
*(Only needed if using n8n Cloud to send delivery callbacks to your local FastAPI)*
```powershell
cd "d:\VIIT\7th\Majoor Project"
npx localtunnel --port 8000
```
Output will display your public URL, e.g.:
`your url is: https://long-pets-brush.loca.lt`

---

## 6. n8n Email Automation Setup

### 6.1 Architecture in n8n
```text
[Webhook Node] ──> [Format Email Code Node] ──> [Gmail / SMTP Node] ──> [HTTP Request Callback]
```

### 6.2 Node-by-Node Setup

1. **Webhook Trigger Node**:
   - **Method**: `POST`
   - **Path**: `nexora-stage-email`
   - **Production URL**: `https://aemnexora.app.n8n.cloud/webhook/nexora-stage-email`
   - **Respond**: `Immediately (200 OK)`

2. **Code Node ("Format Email Data")**:
   Paste the following JavaScript code to format the incoming draft into clean corporate HTML:
   ```javascript
   const raw = $input.first().json;
   const data = (raw && raw.body && typeof raw.body === 'object') ? raw.body : raw;

   const recipientEmail = data.recipient_email || data.to || '';
   const subject = data.subject || 'Project Update';
   const rawBody = typeof data.body === 'string' ? data.body : '';
   const stage = data.stage || 'Update';
   const referenceId = data.reference_id || 'ENQ';
   const emailId = data.email_id || '';

   const formattedBody = rawBody
     .split('\n\n')
     .map(p => `<p style="margin: 0 0 14px 0; line-height: 1.6; color: #334155;">${p.replace(/\n/g, '<br/>')}</p>`)
     .join('');

   const htmlContent = `
   <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
     <div style="border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
       <h2 style="color: #0f172a; margin: 0; font-size: 20px;">Nexora Technologies</h2>
       <span style="display: inline-block; margin-top: 6px; padding: 2px 8px; font-size: 11px; font-weight: 600; color: #2563eb; background: #eff6ff; border-radius: 4px; border: 1px solid #bfdbfe;">
         Stage: ${stage} &bull; Ref: ${referenceId}
       </span>
     </div>
     <div style="font-size: 14px;">
       ${formattedBody}
     </div>
     <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
       <strong>Nexora Enterprise Solutions</strong><br/>
       Client Communications Team &bull; Ref: ${referenceId}
     </div>
   </div>
   `;

   return [{
     json: {
       email_id: emailId,
       stage: stage,
       to: recipientEmail,
       subject: subject,
       html: htmlContent,
       text: rawBody
     }
   }];
   ```

3. **Send Email Node (Gmail or SMTP)**:
   - **Send To**: `={{ $json.to }}`
   - **Subject**: `={{ $json.subject }}`
   - **Email Type**: `HTML`
   - **HTML Message**: `={{ $json.html }}`
   - *Ensure your Gmail account or SMTP credentials are authenticated under "Credentials".*

4. **HTTP Request Callback Node (Optional / Recommended)**:
   - **Method**: `PATCH`
   - **URL**: `https://<YOUR-LOCALTUNNEL-URL>.loca.lt/api/v1/enquiries/webhooks/n8n/email-status`
   - **Headers**:
     - `X-N8N-Webhook-Secret: your_webhook_secret`
     - `Bypass-Tunnel-Reminder: true`
     - `Content-Type: application/json`
   - **JSON Body**:
     ```json
     {
       "email_id": "{{ $('Format Email Data').item.json.email_id }}",
       "status": "DELIVERED",
       "message_id": "{{ $json.id || 'msg-' + $execution.id }}"
     }
     ```
   - **Settings Tab**: Toggle **"Continue On Fail"** to `true`.

---

## 7. Complete End-to-End Demonstration Walkthrough

Follow these steps to demonstrate the complete workflow:

### Step 1: Submit a New Client Enquiry
1. Navigate to `http://localhost:3000/contact` (or use the contact form on the home page).
2. Enter corporate client details:
   - **Name**: `Dr. Sarah Chen`
   - **Email**: *(Enter an email you own to receive the real test email)*
   - **Company**: `Nova Biotech`
   - **Service Interest**: `AI & Autonomous Agents`
   - **Message**: *"We need to develop an autonomous clinical data pipeline with strict HIPAA compliance and multi-agent validation."*
3. Click **"Submit Enterprise Consultation"**.
4. The client receives a generated reference ID, e.g. `ENQ-2026-54719`.

### Step 2: Review in the Admin Portal
1. Open `http://localhost:3000/admin/enquiries`.
2. Notice the live enquiry at the top of the table.
3. Click **"View Details"** to open `/admin/enquiries/[id]`.
4. Observe:
   - **AI Analysis Card**: Groq LLM has automatically extracted intent, assigned priority (`MEDIUM`/`HIGH`), estimated a budget ($45k-$95k), and recommended a team (`AI Solutions Team`).
   - **Audit Timeline**: The creation event and automated triage are stamped with UTC timestamps.
   - **Client Correspondence Widget**: Positioned in the right sidebar, showing correspondence history and a direct **"Open Mail"** link.

### Step 3: Trigger Stage Transition & Automated Email
1. On the 5-stage workflow stepper (`New` $\rightarrow$ `Contacted` $\rightarrow$ `In Discussion` $\rightarrow$ `Proposal Sent` $\rightarrow$ `Converted`), click on **"In Discussion"**.
2. The **Stage Transition & Client Communication Modal** opens.
3. Observe the Groq AI draft spinner: within 1 second, it generates a personalized, professional B2B email tailored to Dr. Sarah Chen, Nova Biotech, and the clinical data pipeline.
4. **Human-in-the-Loop Review**: You can review and edit the subject line or message body text directly.
5. Click **"Confirm & Send Email"**:
   - Status updates to `IN DISCUSSION` across the stepper and badges.
   - The email record is saved in PostgreSQL.
   - FastAPI dispatches the payload to your active n8n webhook.
   - n8n formats the HTML and sends the email to the recipient's inbox.
   - The right sidebar **Client Correspondence** widget displays the new email with the `SENT` / `DELIVERED` badge.
   - Clicking **"Search client replies"** redirects directly to Gmail pre-filtered for that client (`to:sarah.chen@novabiotech.com`).

---

## 8. Automated Testing & Verification

Run these verification suites to guarantee 0 regressions:

### 8.1 Backend Automated Tests (Pytest)
```powershell
cd "d:\VIIT\7th\Majoor Project\backend"
.\.venv\Scripts\Activate.ps1
python -m pytest tests -v
```
*Expected Result*: All 8 test suites pass (`8 passed in < 1s`).

### 8.2 Frontend TypeScript Type Check
```powershell
cd "d:\VIIT\7th\Majoor Project"
npx tsc --noEmit
```
*Expected Result*: Exits with code `0` and zero type errors.

### 8.3 Frontend Production Build
```powershell
cd "d:\VIIT\7th\Majoor Project"
npm run build
```
*Expected Result*: Successful Next.js production build bundle generation.

---

## 9. Troubleshooting & FAQs

### Q1: The n8n execution shows an error on the Webhook node.
- **Answer**: Ensure your workflow toggle is switched to **"Active"** in n8n Cloud. If testing with the "Listen for test event" button, remember that n8n test URLs end with `/webhook-test/nexora-stage-email`. For production 24/7 listening, use `/webhook/nexora-stage-email`.

### Q2: n8n says "The request was blocked because it resolves to a restricted IP address (127.0.0.1)".
- **Answer**: n8n Cloud blocks requests to `127.0.0.1` for SSRF protection. In Node 4 (HTTP Request callback), replace `127.0.0.1:8000` with your active tunnel URL (e.g. `https://long-pets-brush.loca.lt`) and add the header `Bypass-Tunnel-Reminder: true`. Alternatively, toggle "Continue On Fail" in Node 4 settings.

### Q3: An enquiry ID returns 404 in FastAPI.
- **Answer**: If you are viewing an older mock record cached in your browser's `localStorage`, the backend now automatically creates and seeds the missing record in PostgreSQL on the fly using `get_or_create_enquiry()`. You can also click **"Reset to Default"** on the Enquiries table page to flush local cache and load fresh records from PostgreSQL.

### Q4: CORS error when calling backend from another origin.
- **Answer**: Ensure the origin is listed in `CORS_ORIGINS` in `backend/.env`. By default, `http://localhost:3000` and `http://127.0.0.1:3000` are permitted.
