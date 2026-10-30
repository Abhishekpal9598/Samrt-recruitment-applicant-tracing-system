# Software Requirements Specification (SRS)

## Smart Recruitment & Applicant Tracking System (ATS)

**Document Standard:** IEEE Std 830-1998 Conforming Specification  
**Document Version:** 1.0.0  
**Status:** Approved for Implementation (Phase 1 Final)  
**Author:** Senior Full-Stack Software Architect  

---

## 1. Introduction

### 1.1 Purpose
The purpose of this Software Requirements Specification (SRS) document is to provide a complete, rigorous, and unambiguous description of the functional, external interface, and non-functional requirements for the **Smart Recruitment & Applicant Tracking System (ATS)**. This document serves as the binding technical contract between product management, engineering architects, developers, and QA verification teams.

### 1.2 Document Conventions
* **`REQ-F-[MODULE]-[NUM]`**: Identifies a mandatory Functional Requirement.
* **`REQ-NF-[CATEGORY]-[NUM]`**: Identifies a Non-Functional Requirement.
* **`SHALL` / `MUST`**: Denotes an absolute, mandatory system behavior.
* **`SHOULD`**: Denotes a highly recommended capability subject to architectural review.
* **`MAY`**: Denotes an optional or future extension capability.

### 1.3 Intended Audience
This specification is intended for Full-Stack Developers, Database Architects, QA Engineers, DevOps Engineers, and Project Managers.

### 1.4 Product Scope
The Smart Recruitment & ATS platform is an enterprise-grade web application automating the end-to-end recruitment lifecycle from job requisition authoring to post-offer candidate onboarding. The system provides role-based interfaces for Super Admins, Recruiters, Hiring Managers, Interviewers, and Applicants.

---

## 2. Overall Description

### 2.1 Product Perspective
The Smart Recruitment & ATS operates as a centralized web application. The frontend is delivered as a modern Single-Page Application (SPA) built with React.js and Tailwind CSS, interfacing with a RESTful backend API powered by Node.js and Express.js. Persistent relational data is stored within PostgreSQL via Prisma ORM, while document assets (resumes, onboarding proofs) are securely managed on server storage via Multer, and transactional notifications are dispatched via Nodemailer.

```
+-----------------------------------------------------------------------------------+
|                                  USER CLIENTS                                     |
|     [Candidate Browser]       [Recruiter Browser]       [Interviewer Browser]     |
+-----------------------------------------------------------------------------------+
                                          |
                                    HTTPS / TLS 1.3
                                          v
+-----------------------------------------------------------------------------------+
|                        SMART RECRUITMENT ATS PLATFORM                             |
|  +------------------------+  +--------------------------+  +-------------------+  |
|  | Frontend: React.js     |  | Backend: Express.js API  |  | Database:         |  |
|  | - Tailwind UI Engine   |  | - Auth & RBAC Security   |  |   PostgreSQL 15+  |  |
|  | - Candidate Portal     |  | - Candidate Pipeline Svc |  | - Prisma ORM      |  |
|  | - Recruiter Dashboard  |  | - Interview & Offer Svc  |  | - ACID Relational |  |
|  | - Scorecard Forms      |  | - Multer File Ingestion  |  | - JSONB Metadata  |  |
|  +------------------------+  +--------------------------+  +-------------------+  |
+-----------------------------------------------------------------------------------+
             |                                                      |
             v                                                      v
  +--------------------+                                 +--------------------+
  | Protected Storage  |                                 | SMTP Mail Server   |
  | (Resumes & Proofs) |                                 | (Nodemailer Relay) |
  +--------------------+                                 +--------------------+
```

### 2.2 User Classes & Role Hierarchy Reconciliation

The system reconciles the **Three Primary User Tracks** with **Six Granular RBAC System Roles**:

1. **Admin Track:**
   * **Super Admin (`SUPER_ADMIN`):** Technical and organizational administrators responsible for system configuration, user provisioning, global RBAC assignments, audit trail inspection, and department management.
2. **HR & Talent Track:**
   * **HR Manager (`HR_MANAGER`):** High-level talent acquisition leadership managing requisitions, offer approvals, onboarding verification, and executive reporting.
   * **Recruiter (`RECRUITER`):** Operational recruiters handling candidate sourcing, resume screening, pipeline stage movement, interview coordination, and candidate communications.
   * **Hiring Manager (`HIRING_MANAGER`):** Department leaders responsible for reviewing requisition requests, shortlisting applicants, participating in final interview panels, and making hiring recommendations.
   * **Interviewer (`INTERVIEWER`):** Internal employees evaluating candidates during scheduled rounds, submitting quantifiable feedback and structured scorecards.
3. **Candidate Track:**
   * **Candidate (`CANDIDATE`):** External job seekers exploring open postings, submitting applications and resumes, tracking application status, accepting interview invitations, and completing onboarding tasks.

### 2.3 Operating Environment
* **Server Environment:** Node.js v20.x LTS running on Linux/Windows Server with reverse proxy (Nginx or Cloud Native Ingress).
* **Database Engine:** PostgreSQL 15 or higher.
* **Client Environment:** Modern web browsers including Google Chrome (v100+), Mozilla Firefox (v100+), Apple Safari (v15+), and Microsoft Edge (v100+).

### 2.4 Design and Implementation Constraints
* **Authentication Storage:** Under no circumstances shall JWT access tokens be persisted in browser `localStorage` or `sessionStorage`. Tokens must reside strictly in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
* **Zero Direct SQL Execution:** All database queries must be generated through Prisma ORM to guarantee compile-time type safety and neutralize SQL injection attacks.
* **File Upload Constraints:** File ingestion must be limited to PDF and DOCX documents with a strict ceiling of 5 megabytes.
* **Audit Trail Immutability:** Stage transitions and interview scorecards must be append-only and immutable.

---

## 3. Specific Functional Requirements

### 3.1 Authentication & Authorization Module

* **REQ-F-AUTH-01:** The system MUST allow candidate self-registration using valid email, password, full name, and contact details.
* **REQ-F-AUTH-02:** The system MUST hash all user passwords utilizing `bcrypt` with a minimum salt work factor of 12 prior to database storage.
* **REQ-F-AUTH-03:** Upon successful authentication, the system MUST issue an access JWT (15-minute expiration) and set an `HttpOnly`, `Secure`, `SameSite=Strict` cookie, alongside generating an encrypted refresh token (7-day validity) persisted in the database.
* **REQ-F-AUTH-04:** The system MUST support an atomic token refresh mechanism that validates the refresh token from the database, detects token reuse, and issues a rotated token pair.
* **REQ-F-AUTH-05:** The system MUST lock any user account for 15 minutes after 5 consecutive failed authentication attempts.
* **REQ-F-AUTH-06:** The system MUST enforce granular RBAC middleware verifying user role permissions prior to executing any protected route handler.

### 3.2 Job Catalog & Requisition Management

* **REQ-F-JOB-01:** The system MUST allow recruiters and admins to create job requisitions with title, department, description, requirements, experience level, employment type, location, salary range, and application deadline.
* **REQ-F-JOB-02:** The system MUST maintain strict job lifecycle states: `DRAFT`, `PENDING_APPROVAL`, `PUBLISHED`, `ON_HOLD`, `CLOSED`, and `ARCHIVED`.
* **REQ-F-JOB-03:** The system MUST expose an unauthenticated public endpoint listing all jobs currently in `PUBLISHED` state, supporting text search, department filtering, and pagination.
* **REQ-F-JOB-04:** The system MUST automatically prevent candidate submissions to jobs whose status is not `PUBLISHED` or whose deadline has elapsed.
* **REQ-F-JOB-05:** The system MUST allow recruiters to clone an existing job requisition to accelerate new opening configurations.

### 3.3 Candidate Portal & Application Workflow

* **REQ-F-APP-01:** The system MUST allow candidates to submit an application for an active job posting including personal information, LinkedIn profile URL, portfolio URL, and a resume document.
* **REQ-F-APP-02:** If an applicant with the provided email address does not have a user account, the system MUST create a candidate account and dispatch an account activation link via Nodemailer.
* **REQ-F-APP-03:** The system MUST prevent duplicate applications from the same candidate for the exact same job opening while an application is actively in progress.
* **REQ-F-APP-04:** The system MUST provide an authenticated Candidate Dashboard displaying all submitted applications, current pipeline stages, scheduled interviews, and pending offers.
* **REQ-F-APP-05:** The system MUST allow candidates to withdraw an application at any stage before an offer is generated, transitioning the application status to `WITHDRAWN` and logging the candidate's withdrawal notes.

### 3.4 Resume Management & File Processing

* **REQ-F-RES-01:** The system MUST accept resume uploads via Multer strictly restricted to MIME types `application/pdf` and `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
* **REQ-F-RES-02:** The system MUST perform magic byte header verification to ensure uploaded files match their declared MIME types regardless of file extension.
* **REQ-F-RES-03:** The system MUST reject any uploaded file exceeding the maximum size threshold of 5 megabytes.
* **REQ-F-RES-04:** The system MUST store uploaded files using randomly generated UUIDv4 filenames outside the public document root.
* **REQ-F-RES-05:** The system MUST stream file downloads via authenticated endpoints verifying that the requesting user possesses recruiter, hiring manager, or owner permissions.

### 3.5 Recruitment Pipeline & Screening

* **REQ-F-PIPE-01:** The system MUST provide an interactive Kanban board and list view displaying candidates segregated by stage: `APPLIED`, `SCREENING`, `INTERVIEW_SCHEDULED`, `INTERVIEW_COMPLETED`, `OFFERED`, `ACCEPTED`, `REJECTED`, `ONBOARDING`, `HIRED`, `WITHDRAWN`.
* **REQ-F-PIPE-02:** The system MUST record every stage transition into an immutable `ApplicationStageHistory` audit table recording `applicationId`, `fromStage`, `toStage`, `changedByUserId`, `reason`, and `createdAt`.
* **REQ-F-PIPE-03:** When an application is transitioned to `REJECTED`, the system MUST prompt the recruiter with an option to dispatch an automated, polite rejection email using a standardized template.
* **REQ-F-PIPE-04:** The system MUST allow recruiters and hiring managers to record internal notes on a candidate's profile with rich text and private visibility controls.

### 3.6 Interview Coordination & Evaluation Scorecards

* **REQ-F-INT-01:** The system MUST enable recruiters to schedule interviews specifying interview round type, start time, duration (minutes), location or external meeting link (Zoom, Meet, Teams), and assigned interviewer IDs.
* **REQ-F-INT-02:** The system MUST automatically generate an iCalendar (`.ics`) file attachment and transmit meeting invites to the candidate and interviewers via Nodemailer upon scheduling.
* **REQ-F-INT-03:** The system MUST provide designated interviewers with a standardized evaluation scorecard comprising customizable competency categories (Technical, Communication, Cultural Fit, Problem Solving) rated from 1 to 5.
* **REQ-F-INT-04:** The system MUST require interviewers to supply an overall recommendation: `STRONG_HIRE`, `HIRE`, `NO_HIRE`, or `STRONG_NO_HIRE`, along with qualitative summary notes.
* **REQ-F-INT-05:** The system MUST lock a scorecard from further editing once submitted by an interviewer, logging the exact submission timestamp.
* **REQ-F-INT-06:** The system MUST calculate an aggregate scorecard summary score visible to the Hiring Manager and Recruiter to facilitate hiring consensus.

### 3.7 Offer Letter Management

* **REQ-F-OFF-01:** The system MUST allow recruiters to generate formal job offers specifying candidate name, position title, department, annualized base salary, bonus structure, joining date, reporting manager, and offer expiration timestamp.
* **REQ-F-OFF-02:** The system MUST support an internal approval workflow where an offer must be approved by an Admin or Hiring Manager prior to being dispatched to the candidate.
* **REQ-F-OFF-03:** Upon approval, the system MUST transmit a secure notification to the candidate containing an authenticated link to review the complete offer document.
* **REQ-F-OFF-04:** The system MUST provide candidates with an interface to either `ACCEPT` or `DECLINE` the offer. Digital acceptance MUST require typing full legal name, recording the candidate's IP address, user agent, and ISO timestamp.
* **REQ-F-OFF-05:** The system MUST automatically mark an offer as `EXPIRED` if the candidate does not execute acceptance before the specified deadline.

### 3.8 Onboarding Management & Provisioning

* **REQ-F-ONB-01:** Upon offer acceptance, the system MUST automatically transition the candidate's status to `ONBOARDING` and instantiate an `OnboardingWorkflow` with predefined mandatory checklist tasks.
* **REQ-F-ONB-02:** Onboarding tasks MUST include: Personal Information Verification, Government Identification Document Upload, Educational Proof Upload, Bank Account Details, and Emergency Contact Information.
* **REQ-F-ONB-03:** The system MUST allow candidates to upload supporting onboarding documents subject to the same Multer security validations (PDF/DOCX/PNG/JPEG, max 5MB).
* **REQ-F-ONB-04:** The system MUST provide HR managers with an Onboarding Verification Dashboard to review submitted items, mark individual tasks as `VERIFIED` or `REJECTED` (with feedback for re-submission).
* **REQ-F-ONB-05:** Once all mandatory onboarding tasks are verified, the system MUST permit HR to mark the candidate as `HIRED`, completing the talent acquisition lifecycle.

### 3.9 Analytics & Reporting

* **REQ-F-REP-01:** The system MUST calculate and render real-time recruitment metrics: Total Applications, Time-to-Hire (average days from application creation to offer acceptance), Stage Drop-off Velocity, and Offer Acceptance Percentage.
* **REQ-F-REP-02:** The system MUST present pipeline distribution charts illustrating candidate volume across each stage for active jobs.
* **REQ-F-REP-03:** The system MUST generate interviewer SLA reports detailing average hours elapsed between interview completion and scorecard submission.
* **REQ-F-REP-04:** The system MUST allow authorized HR/Admin users to export sanitized recruitment datasets in CSV format.

### 3.10 Automated Email & Notification Engine

* **REQ-F-NOTIF-01:** The system MUST send transactional emails for: (a) Application Submission Acknowledgment, (b) Interview Schedule & Reschedule with `.ics` invites, (c) Formal Job Offer Delivery, (d) Rejection Notices, and (e) Onboarding Task Completion Reminders.
* **REQ-F-NOTIF-02:** The email engine MUST utilize responsive, branded HTML templates with plain text fallbacks.
* **REQ-F-NOTIF-03:** Failed email dispatches MUST be logged in an `EmailLog` table with error codes and retry counters without crashing the primary HTTP request thread.

### 3.11 Enterprise UI/UX Design System Requirements

* **REQ-F-UI-01:** The frontend interface MUST strictly implement the commercial design tokens defined in `docs/DESIGN_SYSTEM.md`, utilizing Inter typography, Deep Indigo and Slate neutral color palettes, and standard 8-point spacing grids.
* **REQ-F-UI-02:** The system MUST support native Light and Dark theme modes with zero contrast degradation or visual flicker.
* **REQ-F-UI-03:** The user interface MUST strictly avoid generic AI dashboard tropes, excessive gradients, glassmorphism, decorative non-functional widgets, or fake statistics.
* **REQ-F-UI-04:** The application MUST provide responsive layouts tailored for Desktop (1280px+), Tablet (768px), and Mobile (375px), including keyboard-accessible navigation and WCAG 2.1 AA contrast compliance.

---

## 4. External Interface Requirements

### 4.1 User Interfaces
* Clean, responsive web interface built using React.js and styled with Tailwind CSS.
* Breakpoints supported: Desktop (1280px+), Laptop (1024px), Tablet (768px), and Mobile (375px+).
* Semantic HTML5 elements and ARIA accessibility labels conforming to WCAG 2.1 Level AA standards.

### 4.2 Software Interfaces
* **Database Interface:** PostgreSQL connected over TCP/IP using Prisma Client with pooled connections.
* **Mail Server Interface:** SMTP connection using Nodemailer configured via TLS on port 587 or 465.
* **Operating System File Storage:** Node.js file system (`fs/promises`) accessed through configured non-public local directory path.

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements
* **REQ-NF-PERF-01:** 95% of standard read API requests MUST complete in under 200 milliseconds under a nominal load of 100 concurrent requests.
* **REQ-NF-PERF-02:** File uploads up to 5 MB MUST complete within 2.5 seconds on standard broadband connections.
* **REQ-NF-PERF-03:** Public career portal initial page load MUST achieve a First Contentful Paint (FCP) of less than 1.2 seconds.

### 5.2 Security Requirements
* **REQ-NF-SEC-01:** All external HTTP traffic MUST be forced over HTTPS utilizing TLS 1.3 encryption.
* **REQ-NF-SEC-02:** Authentication cookies MUST strictly enforce `HttpOnly; Secure; SameSite=Strict`.
* **REQ-NF-SEC-03:** API endpoints MUST employ `express-rate-limit` capped at 100 requests per 15-minute window for standard endpoints and 10 requests per 15-minute window for authentication endpoints.
* **REQ-NF-SEC-04:** Passwords MUST be hashed with `bcrypt` (work factor 12) and never logged or exposed in API responses.
* **REQ-NF-SEC-05:** All SQL interactions MUST be mediated via Prisma ORM parameterized queries.

### 5.3 Software Quality Attributes
* **Availability:** 99.9% uptime target. System health check route (`/api/v1/health`) MUST return status within 50ms.
* **Reliability:** Zero unhandled promise rejections; all errors MUST route through the centralized Express error middleware.
* **Maintainability:** Modular clean-architecture codebase with decoupled controllers, services, repositories, and automated test coverage exceeding 80% on core business logic.
* **Portability:** Container-ready Node.js and PostgreSQL architecture capable of deployment across Linux, Windows, Docker, and major cloud providers.

### 5.4 Continuous Testing & Quality Assurance Requirements
* **REQ-NF-QA-01:** Every feature MUST follow the mandatory development quality workflow: Implement → Test → Identify Bugs → Fix → Retest → Verify → Proceed (`docs/QUALITY_GATES.md`).
* **REQ-NF-QA-02:** Automated unit and integration test suites MUST be executed continuously during development, maintaining >= 80% coverage on core business logic.
* **REQ-NF-QA-03:** All feature integrations MUST undergo cross-browser End-to-End validation via Playwright for critical user journeys prior to feature completion sign-off.
* **REQ-NF-QA-04:** Critical (P0) and High (P1) defects MUST be resolved immediately and verified via regression test runs before proceeding to subsequent tasks.
* **REQ-NF-QA-05:** Test reports, execution logs, and coverage metrics MUST be recorded honestly without fabrication.
