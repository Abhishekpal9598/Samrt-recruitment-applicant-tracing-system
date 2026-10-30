# Comprehensive Continuous Testing Strategy (TESTING_STRATEGY)

## Smart Recruitment & Applicant Tracking System (ATS)

**Document Version:** 2.0.0  
**Status:** Approved Engineering Standard  
**Core Directive:** Continuous Testing Throughout Development (Shift-Left Quality Architecture)  
**Testing Frameworks:** Jest, Supertest, React Testing Library, Playwright  

---

## 1. Testing Philosophy & Shift-Left Strategy

Quality assurance in the Smart Recruitment ATS is not an end-of-project activity. It is an integral, continuous development activity executed iteratively across every feature.

```
       [Unit Tests]            --> Fast, isolated, test pure domain logic & utils (Jest)
            │
            ▼
    [Integration Tests]        --> API endpoints, DB constraints, transactions (Supertest)
            │
            ▼
    [Component & UI Tests]     --> Form validation, state changes, responsive layouts (RTL)
            │
            ▼
   [Cross-Service Integration] --> File ingestion, Nodemailer .ics, cookie auth chains
            │
            ▼
     [Security Test Suite]     --> RBAC, rate-limiting, injection, magic-byte checks
            │
            ▼
     [End-to-End Tests]        --> Full user journeys across browsers (Playwright)
```

### 1.1 Shift-Left Principles
1. **Test-First or Test-Alongside:** Every backend service method and API route must be delivered with corresponding unit and integration tests.
2. **Deterministic & Isolated:** Test suites must never depend on the execution order of other tests or rely on external third-party internet services (e.g., SMTP servers are mocked via ethereal/in-memory transports).
3. **Zero Fabrication Policy:** Test results, coverage percentages, and bug severity reports must be documented honestly. Fabricating test runs or masking failing assertions is strictly prohibited.

---

## 2. Layer-by-Layer Testing Specifications

### 2.1 Frontend Testing (React Testing Library + Jest)

#### Component Testing:
* Validate that UI primitives (Buttons, Status Badges, Candidate Cards) render correctly with all prop variants and theme tokens.
* Assert that accessibility attributes (`aria-expanded`, `aria-haspopup`, `role="table"`) are properly mounted.

#### UI Interaction Testing:
* Simulate user events using `@testing-library/user-event` (clicking, typing, tab navigation, drag-and-drop).
* Verify that Kanban column drags fire the appropriate callback with correct candidate IDs and target stages.

#### Responsive Layout Testing:
* Verify layout behavior at standard viewport breakpoints: Mobile (375px), Tablet (768px), Laptop (1024px), Desktop (1440px).
* Ensure that the collapsible sidebar automatically collapses on tablet/mobile and that horizontal table scroll operates smoothly without layout breaking.

#### Form Validation Testing:
* Test React Hook Form + Zod resolvers against:
  * Empty required fields.
  * Invalid email formats.
  * Salary range validation (ensuring `minSalary <= maxSalary`).
  * File dropzone rejecting unsupported file types (`.exe`, `.jpg`, `.zip`) before upload.

#### Navigation & Route Guard Testing:
* Test `ProtectedRoute` components:
  * Unauthenticated user accessing `/admin/*` or `/recruiter/*` is redirected to `/login`.
  * Candidate attempting to navigate to `/admin/audit-logs` receives an Access Denied / 403 Forbidden screen.

---

### 2.2 Backend Testing (Jest + Supertest)

#### Unit Testing:
* Test domain services (`src/services/*`) in isolation by mocking the Prisma client (`jest-mock-extended`).
* Verify state machine transition guards:
  * Confirming that transitioning from `APPLIED` directly to `HIRED` throws an invalid stage transition error.
  * Confirming that scorecards cannot be submitted if an interview status is `CANCELLED`.

#### API Integration Testing (Supertest):
* Mount the Express `app` against a dedicated PostgreSQL test database.
* Test every route handler across standard success scenarios and intentional edge cases:
  * `POST /api/v1/jobs`: Valid payload returns `201 Created` with correct schema.
  * `GET /api/v1/jobs`: Returns paginated records with correct metadata envelope.

#### Authentication Testing:
* Verify `POST /api/v1/auth/login`:
  * Valid credentials issue `accessToken` and `refreshToken` in `Set-Cookie` headers with `HttpOnly`, `Secure`, and `SameSite=Strict`.
  * Password hashes are never exposed in the response body.
  * Account lock mechanism: 5 consecutive failed logins trigger `lockedUntil` timestamp; 6th attempt returns `429 Too Many Requests` or `401 Unauthorized` with lockout warning.
* Verify `POST /api/v1/auth/refresh`:
  * Rotates refresh token in PostgreSQL.
  * Invalidate all tokens if an already revoked token is used (theft detection).

#### Authorization & RBAC Testing:
* Execute an automated permission matrix test suite:
  * Every protected endpoint is tested against all 6 roles (`SUPER_ADMIN`, `HR_MANAGER`, `RECRUITER`, `HIRING_MANAGER`, `INTERVIEWER`, `CANDIDATE`).
  * Assert that non-authorized roles receive `403 Forbidden` with a standardized error code.

#### Input Validation & Error Handling Testing:
* Submit payloads with extraneous fields (verifying Zod stripping), invalid types (e.g., string for `durationMins`), and SQL injection strings.
* Verify that all errors return the standardized error envelope (`{ success: false, error: { code, message, details } }`).

---

### 2.3 Database Testing (PostgreSQL + Prisma)

#### CRUD Testing:
* Verify create, read, update, and soft-delete operations across all 15 models.
* Confirm that soft-deleted entities (`deletedAt != null`) are excluded from standard queries via Prisma middleware.

#### Relationship Integrity & Foreign Key Testing:
* Assert that deleting an active `Job` with attached `Application` records is rejected by PostgreSQL (`onDelete: Restrict`).
* Assert that deleting a `User` cascades to delete their associated `RefreshToken` records.

#### Transactions & Rollback Testing:
* Simulate an operational failure midway through multi-table workflows:
  * Example: Application submission where resume file metadata fails to save after candidate insertion.
  * Assert that the entire transaction rolls back cleanly, leaving zero orphan candidate or application records.

#### Migration Testing:
* Test execution of declarative Prisma migrations from a fresh database (`prisma migrate reset`) to ensure migrations are idempotent and free of syntax errors.

---

### 2.4 Integration Testing (Cross-Subsystem)

#### Frontend-Backend Integration:
* Test Axios interceptors automatically catching `401 Unauthorized`, requesting `/api/v1/auth/refresh`, and transparently retrying the original API request.
* Test CSRF token propagation on state-modifying requests (`POST`, `PUT`, `PATCH`, `DELETE`).

#### Email Delivery Testing (Nodemailer):
* Utilize a mock Nodemailer transport to inspect dispatched mail payloads:
  * Application acknowledgment email contains correct candidate name and job title.
  * Interview scheduling email contains a valid `.ics` iCalendar MIME attachment conforming to RFC 5545.
  * Email failures do not cause HTTP requests to hang or crash.

#### Resume Upload Pipeline Testing (Multer):
* Test multipart form submission with:
  * Valid PDF file (passes MIME and magic byte checks).
  * Valid DOCX file (passes ZIP/XML magic byte checks).
  * Malicious file: Executable renamed to `malicious.pdf` (caught by magic byte inspector).
  * Oversized file: 6MB PDF (caught by 5MB Multer ceiling).

---

### 2.5 Security Testing Suite

* **Access Control:** Direct ID tampering (Insecure Direct Object Reference - IDOR): Attempt to view candidate profile `/api/v1/applications/:otherCandidateId` using candidate session token; assert `403 Forbidden`.
* **Rate Limiting:** Send 15 consecutive login requests within 60 seconds; assert requests 11–15 return `429 Too Many Requests`.
* **Session Invalidation:** Call `/api/v1/auth/logout`; verify that presenting the previous cookie immediately yields `401 Unauthorized`.
* **PII Segregation:** Assert that responses from `/api/v1/interviews/:id/candidate` do not include sensitive compensation or bank details when requested by an `INTERVIEWER`.

---

### 2.6 End-to-End Testing (Playwright)

Automated cross-browser testing (Chromium, Firefox, WebKit) validating full lifecycle user journeys:

#### Journey 1: Sourcing & Application Flow
1. Unauthenticated candidate browses `/jobs`.
2. Searches for "Engineer", filters by "Remote", opens job view.
3. Fills application form, attaches `sample_resume.pdf`, clicks "Submit Application".
4. Verifies instant success confirmation and checks Candidate Dashboard.

#### Journey 2: Recruiter Screening & Interview Scheduling
1. Recruiter logs in, opens Job Pipeline Kanban view.
2. Drags newly created candidate card from `APPLIED` to `SCREENING`.
3. Opens candidate drawer, previews resume.
4. Clicks "Schedule Interview", selects technical round, sets datetime, selects Interviewer.
5. Verifies interview appears on calendar and stage changes to `INTERVIEW_SCHEDULED`.

#### Journey 3: Interviewer Evaluation & Scorecard
1. Interviewer logs in, views assigned interview in agenda.
2. Opens candidate evaluation screen.
3. Rates 4 criteria (4, 5, 4, 5), selects `STRONG_HIRE`, enters comments, clicks "Submit Scorecard".
4. Verifies scorecard is permanently locked.

#### Journey 4: Offer Generation & Candidate Acceptance
1. HR Manager reviews scorecard consensus, generates offer letter ($150,000 base, Dec 1 start date).
2. Approver approves offer; offer is dispatched.
3. Candidate logs into portal, reviews offer letter, types legal signature, clicks "Accept Offer".
4. Verifies application moves to `ONBOARDING` stage.

#### Journey 5: Onboarding Verification & Final Hire
1. Candidate uploads Government ID and Emergency Contact.
2. HR Manager opens verification queue, verifies uploaded document.
3. Clicks "Finalize Hire"; candidate status updates to `HIRED`.

---

## 3. Test Automation & CI/CD Pipeline Architecture

```
[Git Commit / PR]
       │
       ▼
 1. [Lint & Prettier Check] (ESLint, Tailwind Check)
       │ (Pass)
       ▼
 2. [Backend Unit & Integration Tests] (Jest + Supertest + In-Memory PostgreSQL)
       │ (Pass)
       ▼
 3. [Frontend Component & Interaction Tests] (Jest + RTL)
       │ (Pass)
       ▼
 4. [Security & RBAC Matrix Tests] (Automated 6-role permission sweep)
       │ (Pass)
       ▼
 5. [Playwright E2E Tests] (Headless Browser Suite)
       │ (Pass)
       ▼
 6. [Quality Gate Verification Report]
```
