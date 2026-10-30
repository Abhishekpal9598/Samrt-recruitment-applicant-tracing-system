# Product Requirements Document (PRD)

## Smart Recruitment & Applicant Tracking System (ATS)

**Document Version:** 1.0.0  
**Status:** Approved for Implementation (Phase 1 Final)  
**Author:** Senior Full-Stack Software Architect  
**Target Release:** Production v1.0  
**Primary Source of Truth:** Internship Project Requirements & Enterprise ATS Standards

---

## 1. Executive Summary & Vision

### 1.1 Problem Statement
Modern recruitment processes in growing organizations are often fragmented across disparate communication channels, email inboxes, spreadsheets, and manual document storage. This fragmentation leads to:
* **High Time-to-Hire:** Uncoordinated candidate pipelines and manual scheduling introduce multi-week delays.
* **Poor Candidate Experience:** Lack of transparency and automated communication leaves candidates uninformed regarding their application status.
* **Loss of Candidate Data & Compliance Risks:** Resumes and interview notes scattered across inboxes create significant data privacy and security liabilities (GDPR/DPDP non-compliance).
* **Subjective & Unstructured Evaluations:** Inconsistent evaluation criteria and interview feedback hinder data-driven hiring decisions.
* **Disconnected Post-Offer Transition:** The handoff from offer acceptance to employee onboarding lacks structure, increasing candidate drop-off before Day 1.

### 1.2 Product Vision
The **Smart Recruitment & Applicant Tracking System (ATS)** is a centralized, production-grade web platform engineered to govern the entire talent acquisition lifecycle. By unifying job requisition, candidate screening, resume management, interview scheduling with structured scorecards, digital offer management, onboarding workflows, and hiring analytics into a secure, role-based platform, the system accelerates time-to-hire, elevates candidate engagement, and enforces standardized hiring governance.

---

## 2. Target User Personas & Role Hierarchy Reconciliation

To satisfy both high-level operational workflows and fine-grained enterprise security boundaries, the system structures user interactions across **Three Primary User Persona Tracks**, which map directly to **Six Granular RBAC System Roles**:

```
+---------------------------------------------------------------------------------------------------+
| THREE PRIMARY USER TRACKS          SIX GRANULAR SYSTEM ROLES (RBAC)                               |
+---------------------------------------------------------------------------------------------------+
| 1. ADMIN TRACK              ──►   SUPER_ADMIN (Global system config, audit logs, user governance) |
|                                                                                                   |
| 2. HR & TALENT TRACK        ──┬►  HR_MANAGER (Full requisition, offer approval, onboarding queue) |
|                               ├►  RECRUITER (Job posting, candidate screening, interview booking) |
|                               ├►  HIRING_MANAGER (Requisition review, final panel, offer sign-off)|
|                               └►  INTERVIEWER (Candidate evaluation, structured scorecards)       |
|                                                                                                   |
| 3. CANDIDATE TRACK          ──►   CANDIDATE (Public application, interview RSVP, offer e-sign)    |
+---------------------------------------------------------------------------------------------------+
```

| Primary Track | System Role (`RoleType`) | Key Responsibilities & Capabilities |
| :--- | :--- | :--- |
| **Admin** | `SUPER_ADMIN` | Global platform administration, user provisioning, role assignments, department configuration, system security parameters, and immutable audit trail inspection. |
| **HR (Talent Operations)** | `HR_MANAGER` | Requisition authoring and publishing, pipeline governance, offer generation and approval, onboarding verification, and recruitment analytics. |
| | `RECRUITER` | Candidate sourcing, resume triage, multi-stage Kanban movement, interview scheduling, and candidate communications. |
| | `HIRING_MANAGER` | Department opening review, applicant shortlisting, panel participation, and final hire consensus. |
| | `INTERVIEWER` | Candidate resume review, conducting assigned rounds, and submitting locked quantitative scorecards. |
| **Candidate** | `CANDIDATE` | Exploring public job openings, submitting applications with resumes, tracking stage progression, confirming interview invites, signing digital offers, and completing onboarding checklists. |

---

## 3. Scope of Work

### 3.1 In-Scope Capabilities
1. **Authentication & Identity Governance:**
   * JWT-based session management stored in secure, HTTP-only, SameSite cookies.
   * Granular Role-Based Access Control (RBAC) across Admin, HR, Hiring Manager, Interviewer, and Candidate.
   * Password hashing using `bcrypt` (12 rounds) and brute-force protection.
2. **Job Requisition & Publishing:**
   * Job creation with rich requirements, department, employment type, location, experience level, salary range, and dynamic application form fields.
   * Job lifecycle management: `DRAFT`, `PENDING_APPROVAL`, `PUBLISHED`, `ON_HOLD`, `CLOSED`, `ARCHIVED`.
   * Public-facing career portal for searching, filtering, and viewing open positions.
3. **Candidate Application & Resume Management:**
   * Candidate self-service portal: profile creation, application submission with resume upload.
   * Multer-based secure file ingestion validating MIME types (PDF, DOCX), magic bytes, and file size limits (5 MB max).
   * Centralized resume viewer and parsed metadata storage.
4. **Recruitment Pipeline & Stage Management:**
   * Interactive multi-stage hiring pipeline (`APPLIED`, `SCREENING`, `INTERVIEW_SCHEDULED`, `INTERVIEW_COMPLETED`, `OFFERED`, `ACCEPTED`, `REJECTED`, `ONBOARDING`, `HIRED`, `WITHDRAWN`).
   * Drag-and-drop or status-driven candidate progression with automatic stage audit history.
5. **Interview Scheduling & Evaluation Scorecards:**
   * Scheduling interviews with date, time, duration, location/meeting link, and designated interview panel.
   * Structured, customizable scorecards featuring numerical ratings (1-5 scale) across predefined evaluation criteria and qualitative feedback.
   * Automated calendar invites and email notifications dispatched via Nodemailer.
6. **Offer Letter Management:**
   * Offer creation with compensation breakdown, designation, start date, expiration date, and customizable terms.
   * Offer approval workflow by HR/Admin.
   * Secure candidate offer delivery with digital accept/decline action and electronic signature timestamp.
7. **Onboarding Task Management:**
   * Automated onboarding checklist generation upon offer acceptance.
   * Task assignments (document upload, emergency contact submission, hardware request).
   * HR verification and approval workflow for submitted onboarding items.
8. **Hiring Analytics & Executive Reporting:**
   * Metrics dashboard: Total Applications, Time-to-Hire, Conversion Rates across stages, Source of Hire, Offer Acceptance Rate, and Pipeline Bottleneck analysis.
9. **System Notifications & Email Engine:**
   * Transactional emails via Nodemailer for application confirmation, status changes, interview invites, offer deliveries, and onboarding reminders.
10. **Enterprise UI/UX Design Standards:**
   * Commercial-grade Enterprise HR Tech SaaS visual identity (inspired by Linear, Ashby, Lever).
   * Dense, legible information architecture; high-performance data tables and interactive Kanban pipelines.
   * Full Light and Dark theme support with unified design tokens (`docs/DESIGN_SYSTEM.md` and `docs/UI_UX_SPECIFICATION.md`).
   * Strict avoidance of generic AI dashboard tropes, excessive gradients, glassmorphism, or fake metrics.
11. **Continuous Testing & Quality Assurance:**
   * Shift-left continuous testing embedded into each development cycle (`docs/TESTING_STRATEGY.md`).
   * Mandatory sequential quality gates (Implement → Test → Identify Bugs → Fix → Retest → Verify → Proceed) governed by `docs/QUALITY_GATES.md`.

### 3.2 Out-of-Scope (Phase 1)
* Native mobile applications (iOS/Android) — Phase 1 targets responsive web application.
* Third-party payroll processing integrations (e.g., ADP, Workday) — captured via exportable data contracts.
* Proprietary in-app video conferencing hosting — interviews integrate external meeting URLs (Google Meet, Zoom, MS Teams).
* AI-automated robotic candidate rejections without human-in-the-loop recruiter review.

---

## 4. Detailed Feature & Functional Requirements

### Module 1: Authentication & Access Control
* **PRD-F-001:** System must support email/password registration for candidates and invitation-based onboarding for internal staff (Admin, HR, Hiring Manager, Interviewer).
* **PRD-F-002:** User authentication must issue short-lived JSON Web Tokens (JWT) stored in HTTP-only, Secure, SameSite=Strict cookies paired with database-backed refresh tokens.
* **PRD-F-003:** User accounts must lock for 15 minutes after 5 consecutive failed login attempts.
* **PRD-F-004:** Password reset flow must use cryptographically secure, time-bounded (15 min) single-use tokens sent via Nodemailer.

### Module 2: Job Catalog & Requisition Management
* **PRD-F-005:** Recruiters/Admins can create, edit, clone, and manage job listings with mandatory fields: Title, Department, Location (Remote/Hybrid/Onsite), Type (Full-time, Part-time, Internship, Contract), Description, Qualifications, Experience, Salary Range, and Expiry Date.
* **PRD-F-006:** Public career page must allow unauthenticated candidates to search by keyword and filter by department, location, and employment type.
* **PRD-F-007:** Job postings must follow strict status transitions (`DRAFT` -> `PUBLISHED` -> `CLOSED` / `ARCHIVED`). Only `PUBLISHED` jobs accept applications.

### Module 3: Candidate Portal & Application Flow
* **PRD-F-008:** Unauthenticated candidates can apply by providing profile details (Full Name, Email, Phone, LinkedIn/Portfolio URL) and uploading a resume.
* **PRD-F-009:** System must automatically link applications from existing registered candidates or prompt new candidate registration with magic link / password setup.
* **PRD-F-010:** Candidates must have a dedicated dashboard to view all active applications, current stage, interview appointments, pending offers, and onboarding checklists.
* **PRD-F-011:** Candidates must have the ability to withdraw an application at any point prior to offer generation, capturing an optional withdrawal reason.

### Module 4: Resume Management & File Processing
* **PRD-F-012:** Resume uploads are restricted to `.pdf` and `.docx` extensions with a maximum file size of 5 MB.
* **PRD-F-013:** Backend must perform magic-byte content inspection to prevent executable masquerading before persisting to disk/storage.
* **PRD-F-014:** Uploaded files must be renamed to UUID-based identifiers to prevent directory traversal and filename collision attacks.
* **PRD-F-015:** Recruiters and interviewers can preview and download resumes directly from the candidate profile view.

### Module 5: Recruitment Pipeline & Screening
* **PRD-F-016:** Visual pipeline view (Kanban and tabular) per job displaying candidate cards categorized by stage.
* **PRD-F-017:** Recruiters can transition candidate status with optional transition notes and automated email triggers (e.g., moving to `REJECTED` prompts a rejection email modal).
* **PRD-F-018:** System must maintain an immutable `ApplicationStageHistory` recording stage, previous stage, updatedBy user, and timestamp.
* **PRD-F-019:** Internal collaboration: HR and Hiring Managers can leave internal candidate notes with mention tags and visibility flags.

### Module 6: Interview Coordination & Scorecards
* **PRD-F-020:** Recruiters can schedule interviews specifying Round Name (e.g., Screening, Technical, Culture Fit), Date/Time, Timezone, Duration, Meeting Link, and Assigned Interviewers.
* **PRD-F-021:** Nodemailer must dispatch calendar-compatible `.ics` invites to candidate and interviewers upon interview creation, rescheduling, or cancellation.
* **PRD-F-022:** Interviewers receive access to an evaluation form with quantifiable criteria (e.g., Technical Proficiency, Problem Solving, Communication) rated 1 to 5, an overall recommendation (`STRONG_HIRE`, `HIRE`, `NO_HIRE`, `STRONG_NO_HIRE`), and narrative feedback.
* **PRD-F-023:** Submitted scorecards become locked to maintain integrity; only Super Admin can authorize edits with audit logging.

### Module 7: Offer Letter Management
* **PRD-F-024:** Recruiters can draft offer letters using standardized organizational templates with dynamic placeholders (Candidate Name, Role, Base Salary, Bonus, Joining Date, Offer Expiration Date).
* **PRD-F-025:** Offer status lifecycle: `DRAFT` -> `SENT` -> `ACCEPTED` / `DECLINED` / `EXPIRED` / `REVOKED`.
* **PRD-F-026:** Candidates receive email notification with secure link to review offer details and execute digital acceptance with typed signature and IP/timestamp recording.

### Module 8: Onboarding Management
* **PRD-F-027:** On offer acceptance, candidate status transitions to `ONBOARDING`, and a default onboarding checklist is automatically instantiated.
* **PRD-F-028:** Onboarding tasks include: Personal Details, Identity Verification Documents (Govt ID, Address Proof), Educational Certificates, Bank Account Info, and Emergency Contacts.
* **PRD-F-029:** HR can review submitted onboarding files, mark tasks as `VERIFIED` or `REJECTED` (with feedback for re-upload), and mark the candidate as `HIRED` once all mandatory tasks are fulfilled.

### Module 9: Analytics & Reporting
* **PRD-F-030:** Real-time analytics dashboard presenting key recruitment metrics:
  * Application velocity and source breakdown.
  * Time-to-Hire (days from application to offer accepted).
  * Funnel conversion drop-off rates across all pipeline stages.
  * Recruiter and interviewer SLA compliance (time taken to evaluate candidates).
* **PRD-F-031:** Export capability for recruitment reports to CSV format for external compliance and reporting.

---

## 5. Non-Functional Requirements Summary

| Dimension | Specification | Verification Strategy |
| :--- | :--- | :--- |
| **Performance** | API response times < 200 ms for p95 read endpoints; < 500 ms for write endpoints. Public job board initial page render < 1.5s. | Supertest API benchmarks & Playwright performance traces. |
| **Security** | OWASP Top 10 compliance; strict CORS; CSP, HSTS, and X-Frame-Options via Helmet; bcrypt password hashing; JWT in HTTP-only cookies; parameterized SQL queries via Prisma. | Static security analysis & integration testing. |
| **Availability** | 99.9% uptime target during operational hiring hours. Graceful degradation when external services (e.g., SMTP) experience latency. | Health check endpoints (`/api/v1/health`), circuit breaker patterns. |
| **Scalability** | Capable of supporting 10,000+ active candidates, 500+ concurrent job postings, and 100+ concurrent recruiter sessions without performance degradation. | Normalized PostgreSQL indexing, connection pooling, pagination. |
| **Data Integrity** | Strict database foreign key constraints, ACID compliance, soft deletes (`deletedAt`) on sensitive candidate records, and automated audit logging. | PostgreSQL relational schema constraints & Prisma transactional middleware. |

---

## 6. Success Metrics & Key Performance Indicators (KPIs)

1. **Recruitment Velocity:** 30% reduction in average Time-to-Hire through streamlined pipeline transitions and automated notifications.
2. **Evaluation Compliance:** 95%+ of interview scorecards submitted within 24 hours of interview completion.
3. **Candidate Engagement:** Candidate application drop-off rate kept below 15% via a friction-free, responsive application interface.
4. **Offer Acceptance Rate:** Improved candidate close rate tracking target > 80% with clear digital offer letters.
5. **System Quality:** Zero critical security vulnerabilities, 100% test pass rate across unit and integration suites.

---

## 7. Assumptions, Dependencies & Identified Ambiguities

### 7.1 Assumptions
* Organizations utilize SMTP-compliant mail servers (e.g., SendGrid, Mailgun, Amazon SES, or standard corporate SMTP) for Nodemailer integration.
* Candidates have access to modern desktop or mobile web browsers supporting HTML5 and JavaScript.
* Storage for resumes is initialized on protected server-side local storage with abstracted adapters ready for object storage (AWS S3/GCS) in high-scale environments.

### 7.2 Dependencies
* PostgreSQL 15+ database instance.
* Node.js LTS (v20+) runtime environment.
* Modern web browsers (Chrome, Edge, Firefox, Safari).

### 7.3 Identified Ambiguities & Architectural Resolution
1. *Resume Parsing:* The internship requirement specifies resume management and file uploads without mandating paid AI parsing APIs. **Resolution:** Implement robust metadata extraction, file sanitization, and structured candidate profile forms, providing architectural hooks for third-party parsing engines in future releases.
2. *Document Signatures:* Full DocuSign/AdobeSign API integration is not mandated. **Resolution:** Deliver a compliant internal digital signature mechanism recording candidate full name, timestamp, IP address, and unique verification hash stored in PostgreSQL.
3. *Single-Tenant vs. Multi-Tenant:* Baseline requirements focus on a dedicated organization ATS. **Resolution:** Build a clean modular domain architecture with `organizationId` attributes on core models to allow future multi-tenant expansion without refactoring.
