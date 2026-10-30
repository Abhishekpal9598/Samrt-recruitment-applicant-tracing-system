# Technical Requirements Document (TRD)

## Smart Recruitment & Applicant Tracking System (ATS)

**Document Version:** 1.0.0  
**Status:** Approved for Implementation (Phase 1 Final)  
**Author:** Senior Full-Stack Software Architect  
**Architecture Style:** Layered Monolithic Architecture with Domain-Driven Module Separation  

---

## 1. System Technology Stack & Rationale

```
+----------------------------------------------------------------------------+
|                               FRONTEND                                     |
|  React.js (SPA) + Tailwind CSS + Lucide Icons + React Router + Zod Form    |
+----------------------------------------------------------------------------+
                                     |  HTTPS / JSON / Cookie-Auth
                                     v
+----------------------------------------------------------------------------+
|                          BACKEND (Node.js + Express)                       |
|  [Helmet / CORS / Rate-Limit] -> [Auth Middleware] -> [Controllers]       |
|  -> [Services / Business Logic] -> [Prisma ORM Client]                     |
+----------------------------------------------------------------------------+
       |                           |                          |
       v                           v                          v
+---------------+          +---------------+          +--------------------+
|  PostgreSQL   |          | File Storage  |          | Email Engine       |
|  Database     |          | (Multer/Disk) |          | (Nodemailer/SMTP)  |
+---------------+          +---------------+          +--------------------+
```

### 1.1 Frontend Architecture
* **Library:** React.js (v18+)
  * *Rationale:* Component-driven user interface development, virtual DOM rendering efficiency, declarative state management, rich ecosystem for data tables and visual pipelines.
* **Styling Framework & Design Tokens:** Tailwind CSS (v3+) with Custom Enterprise Tokens (`docs/DESIGN_SYSTEM.md`)
  * *Rationale:* Utility-first CSS framework providing design consistency, responsive breakpoints for mobile/desktop interfaces, zero runtime overhead, and strict adherence to enterprise design tokens (Deep Indigo, Slate neutrals, Inter typography, native Light and Dark theme support).
* **UI/UX Standard:** Enterprise B2B SaaS Recruitment Experience (`docs/UI_UX_SPECIFICATION.md`)
  * *Rationale:* High information density, keyboard navigation, purpose-built Admin, HR, and Candidate workspaces inspired by Linear, Ashby, and Lever; strictly avoids generic AI dashboard tropes, excessive gradients, or fake metrics.
* **Routing:** React Router DOM (v6+)
  * *Rationale:* Client-side routing with nested layouts, protected route guards based on user authentication state and RBAC permissions.
* **State Management & Data Fetching:** Axios with Custom HTTP Interceptors + React Context API / Custom Hooks
  * *Rationale:* Centralized HTTP client managing automatic token refresh, CSRF token propagation, error notification triggers, and client-side caching of server state.
* **Form Management & Validation:** React Hook Form + Zod Resolver
  * *Rationale:* High performance without unnecessary re-renders, strongly typed schema validation matching backend Zod contracts.

### 1.2 Backend Architecture
* **Runtime:** Node.js (v20+ LTS)
  * *Rationale:* Event-driven, non-blocking I/O model ideal for asynchronous workflows, file processing, and API orchestration.
* **Web Framework:** Express.js (v4+)
  * *Rationale:* Unopinionated, robust HTTP middleware framework enabling clean separation of concerns:
    * `Routes`: Endpoint definitions and HTTP method mappings.
    * `Middleware`: Security headers, authentication, RBAC authorization, validation, rate limiting.
    * `Controllers`: HTTP request/response orchestration, parameter parsing, and status code dispatching.
    * `Services`: Pure domain business logic, transactional workflows, and notification dispatches.
    * `Repositories / Prisma Client`: Isolated data persistence queries and relational transformations.
* **Object-Relational Mapping (ORM):** Prisma ORM (v5+)
  * *Rationale:* Type-safe database client, declarative schema modeling (`schema.prisma`), robust migration tooling, relational query optimization, and built-in protection against SQL injection vulnerabilities.

### 1.3 Database Architecture
* **Engine:** PostgreSQL (v15+)
  * *Rationale:* Enterprise-grade open-source relational database. Delivers ACID compliance, native JSONB support for dynamic interview scorecards and custom application metadata, full-text search indexing for resume and job catalog queries, and strong foreign key relational integrity.

### 1.4 Authentication, Cryptography & Security
* **Authentication Engine:** JSON Web Tokens (`jsonwebtoken`)
  * Access Tokens: Short-lived (15 minutes), payload containing `userId`, `email`, and `roles`. Transmitted exclusively via `HttpOnly`, `Secure`, `SameSite=Strict` cookies to neutralize Cross-Site Scripting (XSS) token exfiltration.
  * Refresh Tokens: Long-lived (7 days), cryptographically secure random strings stored hashed in the PostgreSQL `RefreshToken` table with device/IP tracking and rotation mechanics.
* **Password Hashing:** `bcrypt`
  * Work Factor: Salt rounds = 12. Provides resilient resistance against dictionary and rainbow table attacks.
* **Security Middleware:**
  * `helmet`: Sets standard security HTTP headers (Content Security Policy, X-Content-Type-Options, HSTS, Frameguard).
  * `cors`: Whitelists specific origins with credential support (`credentials: true`).
  * `express-rate-limit`: Prevents brute-force denial-of-service and credential stuffing attacks on authentication and file upload routes.

### 1.5 File Handling & Document Storage
* **File Upload Middleware:** `multer`
  * Memory buffering / disk storage pipeline with strict MIME-type whitelisting: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
  * Magic byte verification (`file-type` inspection) to block executable payloads disguised with `.pdf` or `.docx` extensions.
  * File size hard cap: 5 MB per resume/attachment.
  * File naming strategy: Cryptographic UUIDv4 filenames stored in secure, non-public directory structure with access-controlled file streaming endpoints (`/api/v1/resumes/:id/download`).

### 1.6 Communication & Email Dispatch
* **Email Engine:** `nodemailer`
  * Transport: Modular SMTP transport client configured for TLS encryption.
  * Template Rendering: Responsive HTML templates with CSS inlining for application acknowledgments, interview calendar invites, offer delivery, and onboarding triggers.
  * Calendar Integration: Programmatic `.ics` iCalendar payload generation for interview schedules compatible with Outlook, Google Calendar, and Apple Calendar.

### 1.7 Testing Architecture & Continuous Quality Gates
* **Continuous Testing Protocol:** Governed by `docs/TESTING_STRATEGY.md` and `docs/QUALITY_GATES.md` (Workflow: Implement → Test → Identify Bugs → Fix → Retest → Verify → Proceed). Testing occurs continuously during development across every layer.
* **Backend Unit & Integration Testing:** Jest + Supertest
  * Mocking Prisma client for isolated unit tests.
  * In-memory or isolated test database instances for end-to-end integration tests verifying controller-to-database integrity.
* **Frontend Component & Interaction Testing:** Jest + React Testing Library
  * Testing user interaction, form validations, accessibility hooks, and state transitions across Light and Dark themes.
* **End-to-End (E2E) Browser Testing:** Playwright
  * Cross-browser automation (Chromium, Firefox, WebKit) validating full user journeys: Job Application -> Recruiter Screening -> Interview Scorecard -> Offer Acceptance -> Onboarding.
* **Strict Quality Gates:** Zero unresolved P0/P1 defects; regression testing required after every major change; honest reporting standard enforced.

---

## 2. System Layering & Directory Design

```
smart-ats/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma              # Declarative database schema
│   │   └── migrations/                # Version-controlled SQL migrations
│   ├── src/
│   │   ├── config/                    # Environment variables, database, SMTP, CORS
│   │   ├── constants/                 # Roles, statuses, error codes
│   │   ├── controllers/               # Request handling & HTTP responses
│   │   ├── errors/                    # Custom AppError & global error handler
│   │   ├── middlewares/               # Auth, RBAC, Zod validation, Multer, Rate-limit
│   │   ├── routes/                    # Express route declarations
│   │   ├── services/                  # Business logic & domain workflows
│   │   ├── templates/                 # Email HTML templates
│   │   ├── utils/                     # Token generators, file sanitizers, logger
│   │   └── app.js                     # Express app setup & middleware mounting
│   ├── tests/
│   │   ├── integration/               # Supertest API endpoint tests
│   │   └── unit/                      # Service & utility unit tests
│   └── server.js                      # Server entry point & graceful shutdown
├── frontend/
│   ├── public/                        # Static assets & favicon
│   ├── src/
│   │   ├── assets/                    # SVG icons, images
│   │   ├── components/                # Reusable UI primitives (Buttons, Modals, Tables)
│   │   │   ├── common/                # Navbar, Sidebar, Alert, Spinner
│   │   │   ├── forms/                 # Form inputs, file dropzone, validations
│   │   │   └── pipeline/              # Kanban board, candidate cards, drag-and-drop
│   │   ├── context/                   # AuthContext, NotificationContext
│   │   ├── hooks/                     # Custom hooks (useAuth, useFetch, useDebounce)
│   │   ├── layouts/                   # AdminLayout, RecruiterLayout, CandidateLayout
│   │   ├── pages/                     # Routed page views (Jobs, Pipeline, Interviews)
│   │   ├── services/                  # Axios API client functions
│   │   ├── types/                     # TypeScript/JSDoc type contracts
│   │   ├── utils/                     # Formatting, date helpers, validators
│   │   ├── App.jsx                    # Root route definitions
│   │   └── main.jsx                   # React DOM mount point
│   └── tailwind.config.js             # Tailwind CSS tokens & color palette
├── e2e/                               # Playwright test specifications
└── docs/                              # Comprehensive architectural documentation
```

---

## 3. Data Integrity & Concurrency Architecture

### 3.1 Database Transactions
All multi-table operational workflows must execute inside Prisma transactions (`prisma.$transaction(async (tx) => { ... })`) to prevent partial state persistence:
1. **Application Submission:** Candidate record creation/update + Application record creation + Initial `ApplicationStageHistory` entry + Resume metadata record.
2. **Offer Acceptance:** Offer status updated to `ACCEPTED` + Application status updated to `ONBOARDING` + Stage history record inserted + Default `OnboardingWorkflow` and `OnboardingTask` records instantiated.
3. **Interview Cancellation:** Interview status updated to `CANCELLED` + Assigned participant statuses updated + Calendar cancellation email queued.

### 3.2 Optimistic Concurrency Control
For critical state transitions (such as candidate pipeline movement and offer generation), records incorporate `updatedAt` timestamps and version tracking to prevent race conditions when multiple recruiters collaborate simultaneously.

---

## 4. Performance & Scalability Targets

| Metric | Target Specification | Architectural Strategy |
| :--- | :--- | :--- |
| **API p95 Response Time** | < 200 ms for standard CRUD; < 500 ms for file uploads | B-Tree indexing on foreign keys (`jobId`, `candidateId`, `status`), selective Prisma field queries (`select` blocks). |
| **Payload Optimization** | API responses compressed using Gzip/Brotli (`compression` middleware) | Eliminates repetitive data; paginates all collection endpoints (`limit`, `cursor`/`page`). |
| **Public Career Board TTFB**| < 150 ms | Query caching of active public jobs; lean database projections. |
| **Concurrent Users** | 500 concurrent active sessions | Node.js asynchronous event loop; connection pooling configured in PostgreSQL (`max: 20` per instance). |
| **File Storage Throughput** | Streaming downloads without loading entire buffer into memory | Node.js read streams (`fs.createReadStream`) piped directly to Express HTTP response stream. |

---

## 5. Security & Protection Engineering

1. **Defense-in-Depth Authentication:**
   * Cookies configured with: `HttpOnly = true`, `Secure = true` (in production), `SameSite = 'Strict'`, `Path = '/'`.
   * Access token expiration: 15 minutes.
   * Refresh token stored in PostgreSQL as a one-way SHA-256 hash, revoked upon logout or password reset.
2. **Input Validation & Sanitization:**
   * Strict schema validation using Zod on every incoming Express request (`req.body`, `req.params`, `req.query`).
   * Express global error handler intercepting Zod issues and translating them into standard `400 Bad Request` validation error payloads.
3. **Injection Mitigation:**
   * Prisma ORM parameterizes all SQL queries automatically, eliminating SQL injection vectors.
   * HTML escape filters applied to user notes and email template interpolations to prevent XSS.
4. **File Upload Security Protocol:**
   * Random UUID-based storage filenames.
   * Absolute path resolution restricted inside designated storage directory, preventing directory traversal attacks.
   * Direct execution permissions disabled on upload storage directories.

---

## 6. Observability, Logging & Error Handling

### 6.1 Structured Error Architecture
The system employs an extensible `AppError` class inheriting from native `Error`:
```javascript
class AppError extends Error {
  constructor(message, statusCode, errorCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### 6.2 Standardized API Error Response Payload
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid input provided for candidate application.",
    "details": [
      {
        "field": "email",
        "issue": "Must be a valid email address"
      }
    ]
  },
  "timestamp": "2026-10-30T16:30:00.000Z",
  "requestId": "req-98f24b22-83de"
}
```

### 6.3 Structured Logging
* Centralized logging service capturing timestamp, log level (`INFO`, `WARN`, `ERROR`), route, correlation ID, and execution duration.
* PII Redaction: Passwords, JWT secrets, and sensitive candidate personal information are stripped from all log outputs.
