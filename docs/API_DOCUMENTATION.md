# RESTful API Specification (API_DOCUMENTATION)

## Smart Recruitment & Applicant Tracking System (ATS)

**Document Version:** 1.0.0  
**Status:** Approved for Implementation (Phase 1 Final)  
**Author:** Senior Full-Stack Software Architect  
**Base URL:** `/api/v1`  
**Protocol:** HTTPS / TLS 1.3  

---

## 1. Architectural Standards & Response Envelopes

### 1.1 Standard Success Envelope
```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "timestamp": "2026-10-30T16:45:00.000Z",
    "requestId": "req-71af98de-b41a",
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalRecords": 85,
      "totalPages": 5
    }
  }
}
```

### 1.2 Standard Error Envelope
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Application with ID 'e9f1...' does not exist.",
    "details": []
  },
  "meta": {
    "timestamp": "2026-10-30T16:45:00.000Z",
    "requestId": "req-71af98de-b41a"
  }
}
```

### 1.3 Common HTTP Status Codes
* `200 OK`: Request succeeded.
* `201 Created`: Resource successfully created.
* `204 No Content`: Successful mutation with empty body.
* `400 Bad Request`: Validation failure or malformed payload.
* `401 Unauthorized`: Authentication missing or token expired.
* `403 Forbidden`: Insufficient role permissions.
* `404 Not Found`: Requested resource not found.
* `409 Conflict`: Unique constraint violation or state conflict.
* `422 Unprocessable Entity`: Business logic invariant violation.
* `429 Too Many Requests`: Rate limit exceeded.
* `500 Internal Server Error`: Unhandled server exception.

---

## 2. API Endpoints Catalog

### 2.1 Authentication & Session Management (`/api/v1/auth`)

#### 1. Candidate Registration
* **Endpoint:** `POST /api/v1/auth/register`
* **Access:** Public
* **Request Body:**
```json
{
  "email": "alex.rivera@example.com",
  "password": "Password123!",
  "firstName": "Alex",
  "lastName": "Rivera",
  "phoneNumber": "+1-555-0199"
}
```
* **Response (201 Created):** Sets `refreshToken` and `accessToken` in `HttpOnly` cookies.
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr-8a21-99bc",
      "email": "alex.rivera@example.com",
      "firstName": "Alex",
      "lastName": "Rivera",
      "roles": ["CANDIDATE"]
    }
  }
}
```

#### 2. User Login
* **Endpoint:** `POST /api/v1/auth/login`
* **Access:** Public (Rate Limited: 10/15m)
* **Request Body:**
```json
{
  "email": "recruiter@smartats.io",
  "password": "RecruiterSecure#2026"
}
```
* **Response (200 OK):** Sets `accessToken` and `refreshToken` in `HttpOnly` cookies.
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr-12fa-44ed",
      "email": "recruiter@smartats.io",
      "firstName": "Marcus",
      "lastName": "Vance",
      "roles": ["RECRUITER"]
    }
  }
}
```

#### 3. Refresh Session Token
* **Endpoint:** `POST /api/v1/auth/refresh`
* **Access:** Authenticated via `refreshToken` cookie
* **Response (200 OK):** Rotates refresh token in DB, issues new `accessToken` cookie.

#### 4. User Logout
* **Endpoint:** `POST /api/v1/auth/logout`
* **Access:** Authenticated
* **Response (200 OK):** Revokes refresh token in database, clears authentication cookies.

#### 5. Get Current User Profile
* **Endpoint:** `GET /api/v1/auth/me`
* **Access:** Authenticated (Any Role)
* **Response (200 OK):** Returns authenticated user profile, roles, and system permissions.

---

### 2.2 Job Requisition Catalog (`/api/v1/jobs`)

#### 1. List Public Jobs
* **Endpoint:** `GET /api/v1/jobs`
* **Access:** Public
* **Query Parameters:** `page=1`, `limit=20`, `search=Engineer`, `departmentId=dep-1`, `type=FULL_TIME`, `location=Remote`
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "job-43bb-91ea",
      "title": "Senior Full-Stack Engineer",
      "code": "ENG-2026-004",
      "department": { "id": "dep-1", "name": "Engineering" },
      "employmentType": "FULL_TIME",
      "experienceLevel": "SENIOR_LEVEL",
      "location": "Remote",
      "minSalary": 140000,
      "maxSalary": 175000,
      "currency": "USD",
      "deadline": "2026-12-31T23:59:59.000Z",
      "skills": ["React.js", "Node.js", "PostgreSQL"]
    }
  ]
}
```

#### 2. Create Job Requisition
* **Endpoint:** `POST /api/v1/jobs`
* **Access:** `SUPER_ADMIN`, `HR_MANAGER`, `RECRUITER`
* **Request Body:**
```json
{
  "title": "Staff Backend Architect",
  "departmentId": "dep-1",
  "employmentType": "FULL_TIME",
  "experienceLevel": "LEAD",
  "location": "Hybrid - New York",
  "minSalary": 180000,
  "maxSalary": 220000,
  "description": "Architect core scalable services...",
  "requirements": "10+ years backend engineering...",
  "deadline": "2026-11-30T00:00:00.000Z",
  "skillIds": ["skl-node", "skl-postgres", "skl-redis"]
}
```
* **Response (201 Created):** Returns created job entity in `DRAFT` status.

#### 3. Update Job Lifecycle Status
* **Endpoint:** `PATCH /api/v1/jobs/:id/status`
* **Access:** `SUPER_ADMIN`, `HR_MANAGER`
* **Request Body:** `{ "status": "PUBLISHED" }`
* **Response (200 OK):** Returns updated job with `publishedAt` timestamp.

---

### 2.3 Candidate Applications & Pipeline (`/api/v1/applications`)

#### 1. Submit Job Application (with Resume)
* **Endpoint:** `POST /api/v1/jobs/:id/apply`
* **Access:** Public or Authenticated Candidate
* **Content-Type:** `multipart/form-data`
* **Form Fields:**
  * `firstName`: "Alex"
  * `lastName`: "Rivera"
  * `email`: "alex.rivera@example.com"
  * `phoneNumber`: "+1-555-0199"
  * `linkedinUrl`: "https://linkedin.com/in/alexrivera"
  * `resume`: [Binary PDF/DOCX file, <= 5MB]
* **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "applicationId": "app-81ea-720b",
    "stage": "APPLIED",
    "jobTitle": "Senior Full-Stack Engineer",
    "submittedAt": "2026-10-30T16:47:00.000Z"
  }
}
```

#### 2. Get Pipeline Kanban Data
* **Endpoint:** `GET /api/v1/jobs/:id/applications`
* **Access:** `SUPER_ADMIN`, `HR_MANAGER`, `RECRUITER`, `HIRING_MANAGER`
* **Response (200 OK):** Returns candidate application cards grouped by stage (`APPLIED`, `SCREENING`, `INTERVIEW_SCHEDULED`, etc.).

#### 3. Transition Application Stage
* **Endpoint:** `PATCH /api/v1/applications/:id/stage`
* **Access:** `SUPER_ADMIN`, `HR_MANAGER`, `RECRUITER`
* **Request Body:**
```json
{
  "stage": "SCREENING",
  "reason": "Exemplary open-source portfolio and strong resume match."
}
```
* **Response (200 OK):** Returns updated application and logs `ApplicationStageHistory`.

#### 4. Candidate Application Withdrawal
* **Endpoint:** `POST /api/v1/applications/:id/withdraw`
* **Access:** `CANDIDATE` (Owner Only)
* **Request Body:** `{ "reason": "Accepted an alternative offer" }`
* **Response (200 OK):** Transitions stage to `WITHDRAWN`.

#### 5. Stream Secure Resume
* **Endpoint:** `GET /api/v1/resumes/:id/download`
* **Access:** `SUPER_ADMIN`, `HR_MANAGER`, `RECRUITER`, `INTERVIEWER`, `CANDIDATE` (Owner)
* **Response (200 OK):** Binary stream with `Content-Type: application/pdf` or DOCX.

---

### 2.4 Interview Coordination & Scorecards (`/api/v1/interviews`)

#### 1. Schedule Interview Round
* **Endpoint:** `POST /api/v1/applications/:id/interviews`
* **Access:** `SUPER_ADMIN`, `HR_MANAGER`, `RECRUITER`
* **Request Body:**
```json
{
  "roundName": "Technical Architecture Round",
  "type": "TECHNICAL",
  "scheduledAt": "2026-11-04T15:00:00.000Z",
  "durationMins": 60,
  "meetingUrl": "https://meet.google.com/xyz-abcd-qrs",
  "interviewerIds": ["usr-interviewer-1", "usr-interviewer-2"]
}
```
* **Response (201 Created):** Generates `.ics` calendar payload and dispatches emails via Nodemailer.

#### 2. Submit Interview Scorecard
* **Endpoint:** `POST /api/v1/interviews/:id/scorecard`
* **Access:** `INTERVIEWER` (Assigned to Interview)
* **Request Body:**
```json
{
  "recommendation": "STRONG_HIRE",
  "overallRating": 4.5,
  "criteriaScores": {
    "systemDesign": 5,
    "codingProficiency": 4,
    "communication": 5,
    "problemSolving": 4
  },
  "summaryNotes": "Demonstrated deep mastery of PostgreSQL indexing, concurrency, and distributed state."
}
```
* **Response (201 Created):** Scorecard saved and permanently locked (`isLocked: true`).

---

### 2.5 Job Offer Management (`/api/v1/offers`)

#### 1. Draft Job Offer
* **Endpoint:** `POST /api/v1/applications/:id/offers`
* **Access:** `SUPER_ADMIN`, `HR_MANAGER`, `RECRUITER`
* **Request Body:**
```json
{
  "baseSalary": 160000,
  "bonusAmount": 20000,
  "currency": "USD",
  "joiningDate": "2026-12-01T00:00:00.000Z",
  "expiresAt": "2026-11-10T23:59:59.000Z",
  "termsAndConditions": "Standard full-time employment agreement..."
}
```
* **Response (201 Created):** Offer created in `DRAFT` status.

#### 2. Approve and Dispatch Offer
* **Endpoint:** `POST /api/v1/offers/:id/approve`
* **Access:** `SUPER_ADMIN`, `HIRING_MANAGER`
* **Response (200 OK):** Updates offer to `SENT`, application to `OFFERED`, and sends email to candidate.

#### 3. Candidate Digital Acceptance (E-Signature)
* **Endpoint:** `POST /api/v1/offers/:id/accept`
* **Access:** `CANDIDATE` (Offer Recipient)
* **Request Body:**
```json
{
  "signedName": "Alex Rivera",
  "consent": true
}
```
* **Response (200 OK):** Records digital signature, IP address, and timestamp. Transitions application to `ONBOARDING` and generates onboarding checklist.

---

### 2.6 Onboarding Management (`/api/v1/onboarding`)

#### 1. Get Candidate Onboarding Checklist
* **Endpoint:** `GET /api/v1/onboarding/me`
* **Access:** `CANDIDATE`
* **Response (200 OK):** Returns list of required tasks (Govt ID, Bank Details, Degrees) with current submission statuses.

#### 2. Submit Onboarding Task Verification Proof
* **Endpoint:** `POST /api/v1/onboarding/tasks/:taskId/submit`
* **Access:** `CANDIDATE`
* **Content-Type:** `multipart/form-data`
* **Form Fields:** `document` (PDF/Image <= 5MB) or `textContent` (e.g. Account Number).
* **Response (200 OK):** Updates task status to `SUBMITTED`.

#### 3. HR Verification of Task
* **Endpoint:** `POST /api/v1/onboarding/tasks/:taskId/verify`
* **Access:** `SUPER_ADMIN`, `HR_MANAGER`
* **Request Body:**
```json
{
  "status": "VERIFIED",
  "rejectionReason": null
}
```
* **Response (200 OK):** Updates task status.

#### 4. Finalize Hiring Lifecycle
* **Endpoint:** `POST /api/v1/applications/:id/finalize-hire`
* **Access:** `SUPER_ADMIN`, `HR_MANAGER`
* **Response (200 OK):** Validates all mandatory onboarding tasks are verified; transitions Application to `HIRED`.

---

### 2.7 Analytics & Executive Reporting (`/api/v1/analytics`)

#### 1. Recruitment Overview Metrics
* **Endpoint:** `GET /api/v1/analytics/overview`
* **Access:** `SUPER_ADMIN`, `HR_MANAGER`
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalApplications": 1240,
    "activeJobs": 14,
    "averageTimeToHireDays": 21.4,
    "offerAcceptanceRatePercent": 84.6,
    "stageDistribution": {
      "APPLIED": 420,
      "SCREENING": 280,
      "INTERVIEW_SCHEDULED": 150,
      "INTERVIEW_COMPLETED": 90,
      "OFFERED": 35,
      "ONBOARDING": 28,
      "HIRED": 115,
      "REJECTED": 122
    }
  }
}
```

#### 2. Export Candidate Dataset (CSV)
* **Endpoint:** `GET /api/v1/analytics/export/csv`
* **Access:** `SUPER_ADMIN`, `HR_MANAGER`
* **Response (200 OK):** Streams downloadable `Content-Type: text/csv` report.
