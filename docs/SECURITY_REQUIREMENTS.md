# Security, Privacy & Data Protection Requirements (SECURITY_REQUIREMENTS)

## Smart Recruitment & Applicant Tracking System (ATS)

**Document Version:** 1.0.0  
**Status:** Approved for Implementation (Phase 1 Final)  
**Author:** Senior Full-Stack Software Architect  
**Compliance Standards:** OWASP Top 10 (2021), GDPR, DPDP Act  

---

## 1. Threat Modeling & OWASP Top 10 Mitigation Matrix

| OWASP Threat Category | Specific ATS Risk Scenario | Technical Architecture Mitigation |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | An unprivileged candidate or interviewer tampers with URL IDs to read other candidate resumes or alter offer amounts. | Strict RBAC middleware on every endpoint paired with ABAC ownership checks (`requireOwnershipOrAdmin`). Prisma queries scope lookups to `userId` or assigned `departmentId`. |
| **A02: Cryptographic Failures** | Interception of session tokens over unencrypted channels or exposure of plain-text passwords during a database breach. | Mandatory TLS 1.3 encryption in transit. Passwords hashed using `bcrypt` (work factor 12). JWTs transmitted exclusively via `HttpOnly`, `Secure`, `SameSite=Strict` cookies. Refresh tokens stored as SHA-256 hashes. |
| **A03: Injection** | Attacker injects malicious SQL via search fields or XSS scripts via candidate notes and profile bios. | Prisma ORM parameterizes 100% of SQL statements. Zod validates and strips undeclared fields. React automatically escapes JSX expressions. HTML sanitization applied to rich-text notes before rendering. |
| **A04: Insecure Design** | Interviewers collude to modify evaluations post-consensus or candidates spam unlimited applications. | Scorecard immutability enforced at database level (`isLocked: true`). Compound unique constraints `(candidateId, jobId)` block application spamming. |
| **A05: Security Misconfiguration** | Unhandled stack traces leaked to clients in production or overly permissive CORS headers allowing foreign domains to make requests. | Express centralized error handler sanitizes stack traces in production. `cors` middleware explicitly restricts `Access-Control-Allow-Origin` to trusted application domains. `helmet` applies defensive HTTP headers. |
| **A06: Vulnerable & Outdated Components** | Exploits against third-party Node.js dependencies. | Automated vulnerability scanning with `npm audit` integrated into CI/CD pipelines. Pinned dependency versions in `package-lock.json`. |
| **A07: Identification & Authentication Failures** | Brute-force credential attacks or session hijacking. | `express-rate-limit` caps login attempts to 10 per 15 minutes. Account lockout triggered after 5 consecutive failures for 15 minutes. Short access token TTL (15 min) paired with one-time refresh token rotation. |
| **A08: Software & Data Integrity Failures** | Upload of malicious executable disguised as a PDF resume (`resume.exe.pdf`). | Multer pipeline validates file extension, declared MIME type, and inspects magic bytes (`file-type`). Files are stored using UUIDv4 filenames outside webroot without execution permissions. |
| **A09: Security Logging & Monitoring Failures** | Administrative actions (e.g. salary changes, role escalations) occur without traceability. | Dedicated `AuditLog` table records user ID, IP address, user agent, target entity, action type, and diff payload on all mutations. |
| **A10: Server-Side Request Forgery (SSRF)** | Recruiter inputs malicious internal IP into meeting link or portfolio URL triggering server-side requests. | External URLs (e.g. portfolio links) are stored strictly as text attributes rendered client-side; backend services never fetch external URLs directly. |

---

## 2. Authentication & Session Hardening Architecture

### 2.1 Defense-in-Depth Cookie Configuration
```javascript
const cookieOptions = {
  httpOnly: true,                                      // Inaccessible to client JavaScript (neutralizes XSS token theft)
  secure: process.env.NODE_ENV === 'production',       // Transmitted strictly over HTTPS
  sameSite: 'strict',                                  // Neutralizes Cross-Site Request Forgery (CSRF)
  path: '/',
  maxAge: 15 * 60 * 1000                              // 15 minutes TTL for access tokens
};
```

### 2.2 Refresh Token Rotation & Theft Detection
1. When a client requests a new access token via `/api/v1/auth/refresh`, the backend queries the `RefreshToken` table matching the SHA-256 hash of the presented token.
2. If the token is found and active (`isRevoked: false` and `expiresAt > NOW()`):
   * The token is immediately marked `isRevoked: true`.
   * A new refresh token is generated, hashed, and saved to the database.
   * A new access token cookie and new refresh token cookie are dispatched.
3. If an already revoked token is submitted (indicating token theft):
   * The system immediately flags a security incident.
   * All active refresh tokens belonging to that `userId` are invalidated, forcing a full re-authentication across all user sessions.

### 2.3 Password Security & Hashing Standard
* Work factor: `bcrypt.hash(password, 12)`
* Password complexity policy enforced via Zod:
  * Minimum 8 characters, maximum 64 characters.
  * At least one uppercase letter `[A-Z]`.
  * At least one lowercase letter `[a-z]`.
  * At least one numeric digit `[0-9]`.
  * At least one special symbol `[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]`.

---

## 3. File Upload & Malware Mitigation Pipeline

```
[Incoming HTTP Multipart Request]
                │
                ▼
      [Multer Size Check] ─────────► [Exceeds 5MB?] ──► Reject 400 Bad Request
                │ (Passes)
                ▼
      [MIME Type Check] ──────────► [Not PDF/DOCX?] ─► Reject 400 Bad Request
                │ (Passes)
                ▼
   [Magic Bytes Inspection] ───────► [Bytes mismatch?] ─► Reject 400 Bad Request
                │ (Passes)
                ▼
 [Generate UUIDv4 Storage Name]
                │
                ▼
[Write to Protected Disk Root (No Exec)]
                │
                ▼
 [Save Hash & Metadata in PostgreSQL]
```

### 3.1 Verification Invariants
1. **Extension & MIME Validation:** Allowed extensions: `.pdf`, `.docx`. Allowed MIME types: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
2. **Magic Byte Signature Inspection:** Reads the initial 4 to 8 bytes of the file stream to ensure compliance:
   * PDF header: `%PDF-` (`0x25 0x50 0x44 0x46`)
   * DOCX (ZIP archive header): `PK\x03\x04` (`0x50 0x4B 0x03 0x04`)
3. **Storage Isolation:** Uploaded documents reside outside the web server's static asset root. Files cannot be requested directly by filename.
4. **Controlled Streaming:** File retrieval is handled exclusively via authenticated endpoints (`/api/v1/resumes/:id/download`) which verify user authorization before piping the file stream.

---

## 4. Privacy & Data Protection Compliance (GDPR & DPDP Act)

### 4.1 Candidate Consent & Privacy Notice
* Candidates must check an explicit, unbundled consent checkbox during application submission:
  > *"I agree to the processing and storage of my personal data and resume for recruitment purposes in accordance with the Privacy Policy."*
* Timestamp and consent version are logged in the candidate profile record.

### 4.2 Right to be Forgotten (Data Erasure & Anonymization)
Upon receiving a verified deletion request:
* The candidate's `User` record undergoes pseudonymization:
  * `email` updated to `deleted-user-[uuid]@anonymized.local`
  * `firstName`, `lastName`, `phoneNumber` cleared.
  * `passwordHash` and `Profile` deleted.
* Stored resume files are permanently unlinked and deleted from storage.
* `ApplicationStageHistory` retains anonymized stage velocity metrics without personal identifiable information.

### 4.3 Data Minimization & PII Access Segregation
* Interviewers only have visibility into candidate qualifications, portfolio links, and interview feedback; compensation details, address, and sensitive onboarding documents remain restricted to HR Managers and Super Admins.

---

## 5. Network, Rate Limiting & HTTP Security Headers

### 5.1 Rate Limiting Architecture
```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again in 15 minutes.'
    }
  }
});
```

### 5.2 Helmet Header Defense Configurations
* `Content-Security-Policy`: Restricts scripts, styles, and image origins.
* `X-Frame-Options`: Set to `DENY` to eliminate UI redressing/clickjacking.
* `X-Content-Type-Options`: Set to `nosniff` to prevent MIME-type sniffing.
* `Strict-Transport-Security`: `max-age=31536000; includeSubDomains; preload` forcing HTTPS.
* `Referrer-Policy`: `no-referrer-when-downgrade`.
