# Complete Application Flow Document (APP_FLOW)

## Smart Recruitment & Applicant Tracking System (ATS)

**Document Version:** 1.0.0  
**Status:** Approved for Implementation (Phase 1 Final)  
**Author:** Senior Full-Stack Software Architect  

---

## 1. High-Level Hiring Lifecycle Flow

The complete hiring process encompasses seven synchronized phases spanning requisition creation to employee onboarding:

```mermaid
flowchart TD
    A["1. Job Requisition & Publishing (Recruiter/Admin)"] --> B["2. Candidate Sourcing & Application (Candidate)"]
    B --> C["3. Resume Ingestion & Recruiter Screening (HR/Hiring Manager)"]
    C --> D{"Screening Decision"}
    D -- "Reject" --> R["Rejection Notice (Automated Email)"]
    D -- "Pass" --> E["4. Interview Scheduling & Evaluation (Interviewers)"]
    E --> F{"Interview Consensus"}
    F -- "No Hire" --> R
    F -- "Hire" --> G["5. Offer Letter Generation & Approval (HR/Admin)"]
    G --> H["Candidate Offer Review & Digital Acceptance"]
    H -- "Declined / Expired" --> R
    H -- "Accepted" --> I["6. Onboarding Checklist & Document Verification (Candidate & HR)"]
    I --> J["7. Final Hire Completion & Archival (HIRED Status)"]
```

---

## 2. State Machines & Transition Logic

### 2.1 Candidate Application State Machine

```mermaid
stateDiagram-v2
    [*] --> APPLIED : Candidate submits application with resume
    APPLIED --> SCREENING : Recruiter reviews profile & resume
    APPLIED --> REJECTED : Profile does not meet baseline criteria
    APPLIED --> WITHDRAWN : Candidate voluntarily withdraws

    SCREENING --> INTERVIEW_SCHEDULED : Candidate shortlisted for interview
    SCREENING --> REJECTED : Candidate rejected after initial review
    SCREENING --> WITHDRAWN : Candidate voluntarily withdraws

    INTERVIEW_SCHEDULED --> INTERVIEW_COMPLETED : All assigned interviewers submit scorecards
    INTERVIEW_SCHEDULED --> INTERVIEW_SCHEDULED : Rescheduled / Next round scheduled
    INTERVIEW_SCHEDULED --> WITHDRAWN : Candidate voluntarily withdraws

    INTERVIEW_COMPLETED --> OFFERED : Hiring team approves candidate
    INTERVIEW_COMPLETED --> INTERVIEW_SCHEDULED : Additional interview round requested
    INTERVIEW_COMPLETED --> REJECTED : Negative scorecard consensus

    OFFERED --> ACCEPTED : Candidate signs and accepts offer
    OFFERED --> REJECTED : Candidate declines offer
    OFFERED --> REJECTED : Offer expires without candidate action
    OFFERED --> SCREENING : Offer renegotiation / revision

    ACCEPTED --> ONBOARDING : Automated onboarding checklist created
    ONBOARDING --> HIRED : All mandatory verification tasks approved by HR
    ONBOARDING --> REJECTED : Background verification failure / Offer rescinded

    REJECTED --> [*]
    WITHDRAWN --> [*]
    HIRED --> [*]
```

#### Detailed Transition Matrix: Application Stages

| Current Stage | Permitted Target Stage | Actor / Trigger | Guard Conditions & Automated Actions |
| :--- | :--- | :--- | :--- |
| `APPLIED` | `SCREENING` | Recruiter | Candidate profile and resume verified; stage audit logged. |
| `APPLIED` | `REJECTED` | Recruiter | Rejection reason supplied; rejection email queued. |
| `APPLIED` | `WITHDRAWN` | Candidate | Candidate submits withdrawal; recruiter notified. |
| `SCREENING` | `INTERVIEW_SCHEDULED` | Recruiter | Interview date, duration, and at least 1 interviewer selected. Calendar `.ics` dispatched. |
| `SCREENING` | `REJECTED` | Recruiter / Hiring Mgr | Rejection reason recorded; candidate notified. |
| `INTERVIEW_SCHEDULED` | `INTERVIEW_COMPLETED` | System / Recruiter | All scheduled scorecards submitted and locked. |
| `INTERVIEW_COMPLETED` | `OFFERED` | Recruiter / Admin | Offer letter approved internally by Hiring Manager/Admin. |
| `INTERVIEW_COMPLETED` | `INTERVIEW_SCHEDULED` | Recruiter | New round (e.g., Executive / Cultural) created. |
| `INTERVIEW_COMPLETED` | `REJECTED` | Recruiter | Team decision marked as `NO_HIRE`. |
| `OFFERED` | `ACCEPTED` | Candidate | E-signature executed; timestamp and IP recorded. Onboarding checklist instantiated. |
| `OFFERED` | `REJECTED` | Candidate / System | Candidate clicks decline or expiry date reached. |
| `ACCEPTED` | `ONBOARDING` | System | Automatic trigger upon offer acceptance. |
| `ONBOARDING` | `HIRED` | HR Manager | All required onboarding document tasks marked `VERIFIED`. |

---

### 2.2 Job Requisition State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Recruiter authors requisition
    DRAFT --> PENDING_APPROVAL : Submitted for budget/headcount review
    DRAFT --> PUBLISHED : Immediate publish (if authorized)
    PENDING_APPROVAL --> PUBLISHED : Approved by Department Admin
    PENDING_APPROVAL --> DRAFT : Changes requested
    PUBLISHED --> ON_HOLD : Hiring paused temporarily
    ON_HOLD --> PUBLISHED : Hiring resumed
    PUBLISHED --> CLOSED : Requisition fulfilled or cancelled
    ON_HOLD --> CLOSED : Requisition cancelled
    CLOSED --> ARCHIVED : Retention cleanup after 90 days
    ARCHIVED --> [*]
```

---

## 3. End-to-End Sequence Diagrams

### 3.1 Flow 1: Candidate Registration & Job Application

```mermaid
sequenceDiagram
    autonumber
    actor C as Candidate
    participant UI as React Frontend
    participant API as Express API
    participant MLT as Multer & Sanitizer
    participant DB as PostgreSQL (Prisma)
    participant ML as Nodemailer Engine

    C->>UI: Selects Job & completes application form
    C->>UI: Attaches Resume (PDF/DOCX)
    UI->>API: POST /api/v1/jobs/:id/apply (multipart/form-data)
    API->>MLT: Inspect MIME type, size <= 5MB & magic bytes
    alt File Invalid or Exceeds 5MB
        MLT-->>API: FileValidationError
        API-->>UI: 400 Bad Request ("Invalid file format or size")
        UI-->>C: Displays upload error message
    else File Valid
        MLT->>MLT: Generate UUIDv4 filename & persist to storage
        MLT-->>API: File metadata (path, size, hash)
        API->>DB: prisma.$transaction (Create/Update Candidate, Application, StageHistory, Resume)
        DB-->>API: Application record created
        API->>ML: Queue application confirmation email
        ML-->>C: Deliver acknowledgment email with tracking link
        API-->>UI: 201 Created (Application Details & Tracking Token)
        UI-->>C: Renders success confirmation & dashboard link
    end
```

---

### 3.2 Flow 2: Recruiter Screening & Pipeline Progression

```mermaid
sequenceDiagram
    autonumber
    actor R as Recruiter
    participant UI as React Frontend (Kanban)
    participant API as Express API
    participant DB as PostgreSQL (Prisma)

    R->>UI: Navigates to Job Pipeline Kanban View
    UI->>API: GET /api/v1/jobs/:id/applications
    API->>DB: Query applications grouped by stage with candidate & resume info
    DB-->>API: Return application dataset
    API-->>UI: 200 OK (Render Kanban columns)
    R->>UI: Drags candidate card from 'APPLIED' to 'SCREENING'
    UI->>API: PATCH /api/v1/applications/:id/stage { stage: 'SCREENING', reason: 'Strong skillset' }
    API->>DB: Validate permitted stage transition
    API->>DB: prisma.$transaction (Update Application stage, Insert ApplicationStageHistory)
    DB-->>API: Updated record
    API-->>UI: 200 OK (Application updated)
    UI-->>R: Updates card visual position & displays success toast
```

---

### 3.3 Flow 3: Interview Scheduling & Scorecard Evaluation

```mermaid
sequenceDiagram
    autonumber
    actor R as Recruiter
    actor I as Interviewer
    actor C as Candidate
    participant UI as React Frontend
    participant API as Express API
    participant DB as PostgreSQL (Prisma)
    participant ML as Nodemailer Engine

    R->>UI: Selects candidate -> "Schedule Interview"
    R->>UI: Sets round (Technical), date, time, duration (45m), meeting link, selects Interviewer(s)
    UI->>API: POST /api/v1/applications/:id/interviews
    API->>DB: Create Interview & InterviewParticipant records
    API->>DB: Update Application stage to 'INTERVIEW_SCHEDULED'
    API->>ML: Generate .ics calendar payload & dispatch invites
    ML-->>C: Email calendar invitation with meeting link
    ML-->>I: Email calendar invitation with candidate profile & resume link
    API-->>UI: 201 Created
    UI-->>R: Shows scheduled status on timeline

    Note over I, UI: Post-Interview Evaluation
    I->>UI: Accesses Interview Scorecard interface
    I->>UI: Rates competencies (1-5), recommendation ('HIRE'), narrative feedback
    UI->>API: POST /api/v1/interviews/:id/scorecard
    API->>DB: Insert InterviewScorecard & lock record
    API->>DB: Check if all assigned interviewers submitted scorecards
    opt All scorecards submitted
        API->>DB: Update Application stage to 'INTERVIEW_COMPLETED'
    end
    DB-->>API: Scorecard persisted
    API-->>UI: 201 Created (Scorecard locked)
    UI-->>I: Confirmation: "Evaluation submitted successfully"
```

---

### 3.4 Flow 4: Offer Generation, Approval & Candidate E-Signature

```mermaid
sequenceDiagram
    autonumber
    actor R as Recruiter
    actor A as Admin / Approver
    actor C as Candidate
    participant UI as React Frontend
    participant API as Express API
    participant DB as PostgreSQL (Prisma)
    participant ML as Nodemailer Engine

    R->>UI: Drafts Offer Letter (Salary, Joining Date, Equity, Expiry Date)
    UI->>API: POST /api/v1/applications/:id/offers
    API->>DB: Create JobOffer in 'DRAFT' status
    API-->>UI: 201 Created
    R->>UI: Submits offer for internal approval
    UI->>API: POST /api/v1/offers/:id/request-approval
    API->>ML: Notify Admin/Approver via email
    A->>UI: Reviews offer parameters & clicks "Approve"
    UI->>API: POST /api/v1/offers/:id/approve
    API->>DB: Update JobOffer to 'SENT' & Application to 'OFFERED'
    API->>ML: Email Candidate with secure link to review offer
    ML-->>C: "Job Offer from Company: Review and Sign"

    C->>UI: Clicks link, reviews compensation & terms
    alt Candidate Declines Offer
        C->>UI: Clicks "Decline", inputs reason
        UI->>API: POST /api/v1/offers/:id/decline { reason: 'Accepted another offer' }
        API->>DB: Update JobOffer to 'DECLINED' & Application to 'REJECTED'
        API-->>UI: 200 OK
    else Candidate Accepts Offer
        C->>UI: Types full legal name for digital signature & clicks "Accept Offer"
        UI->>API: POST /api/v1/offers/:id/accept { signatureName: 'Jane Doe', consent: true }
        API->>DB: Record digital signature, IP address, user agent, timestamp
        API->>DB: Update JobOffer to 'ACCEPTED' & Application to 'ONBOARDING'
        API->>DB: Instantiate default OnboardingWorkflow & tasks
        API->>ML: Send congratulations email to Candidate & notification to HR
        API-->>UI: 200 OK
        UI-->>C: Redirects to Onboarding Checklist Portal
    end
```

---

### 3.5 Flow 5: Post-Offer Onboarding Checklist & Verification

```mermaid
sequenceDiagram
    autonumber
    actor C as Candidate
    actor HR as HR Manager
    participant UI as React Frontend
    participant API as Express API
    participant DB as PostgreSQL (Prisma)

    C->>UI: Views Onboarding Dashboard (Tasks: Govt ID, Bank Details, Degree)
    C->>UI: Uploads ID Proof (PDF) and submits bank account details
    UI->>API: POST /api/v1/onboarding/tasks/:taskId/submit (multipart/form-data)
    API->>DB: Save submission metadata and update task status to 'PENDING_VERIFICATION'
    API-->>UI: 200 OK
    UI-->>C: Task marked as "Under Review"

    HR->>UI: Opens HR Onboarding Verification Queue
    UI->>API: GET /api/v1/onboarding/verifications
    API->>DB: Fetch pending onboarding submissions
    DB-->>API: Return pending candidate tasks
    API-->>UI: 200 OK
    HR->>UI: Reviews uploaded ID proof
    alt Document Rejected
        HR->>UI: Marks "Rejected", enters reason: "Image blurry"
        UI->>API: POST /api/v1/onboarding/tasks/:taskId/verify { status: 'REJECTED', notes: 'Image blurry' }
        API->>DB: Update task to 'REJECTED'
        API-->>UI: 200 OK
        UI-->>C: Notification prompting document re-upload
    else Document Approved
        HR->>UI: Marks "Approved"
        UI->>API: POST /api/v1/onboarding/tasks/:taskId/verify { status: 'VERIFIED' }
        API->>DB: Update task to 'VERIFIED'
        API->>DB: Check if all mandatory tasks are 'VERIFIED'
        opt All mandatory tasks verified
            HR->>UI: Clicks "Complete Onboarding & Mark as Hired"
            UI->>API: POST /api/v1/applications/:id/finalize-hire
            API->>DB: Update Application status to 'HIRED'
            API-->>UI: 200 OK
            UI-->>HR: "Candidate successfully hired and onboarded!"
        end
    end
```

---

## 4. Edge Cases & Exception Workflows

### 4.1 Application Withdrawal
* **Trigger:** Candidate opts out by clicking "Withdraw Application" on the portal.
* **Handling:**
  * System prompts for optional reason (e.g., accepted another offer, personal reasons).
  * Backend verifies that the current stage is prior to `HIRED`.
  * Status updates to `WITHDRAWN`.
  * Any scheduled upcoming interviews are automatically flagged as `CANCELLED`, freeing interviewer slots.
  * Recruiter receives a dashboard alert.

### 4.2 Interview Rescheduling
* **Trigger:** Recruiter or Interviewer requests a time change.
* **Handling:**
  * Recruiter updates the interview appointment with new datetime.
  * System retains the original interview ID but increments a `rescheduleCount` attribute.
  * Nodemailer sends an updated `.ics` calendar invitation marked `STATUS:CONFIRMED` with updated sequence number to automatically update participant calendar clients.

### 4.3 Expired Job Offers
* **Trigger:** Scheduled cron/periodic job checks for `SENT` offers whose `expiresAt` date has passed.
* **Handling:**
  * System transitions offer status from `SENT` to `EXPIRED`.
  * Candidate application transitions to `REJECTED` (with sub-status `OFFER_EXPIRED`).
  * Recruiter and Candidate receive notification of offer expiration.
  * Recruiter retains option to extend the expiration date and re-issue the offer.

### 4.4 Disrupted File Uploads
* **Trigger:** Network failure or file verification rejection during resume or onboarding upload.
* **Handling:**
  * Multer unlinks any partially streamed temporary files immediately to prevent orphan disk clutter.
  * Backend returns structured validation error detailing exact failure reason (e.g., `FILE_SIZE_EXCEEDED`, `UNSUPPORTED_MIME_TYPE`).
  * React dropzone resets cleanly and prompts candidate for retry.
