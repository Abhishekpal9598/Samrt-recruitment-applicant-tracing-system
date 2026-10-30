# Role-Based Access Control (RBAC) & Permission Matrix

## Smart Recruitment & Applicant Tracking System (ATS)

**Document Version:** 1.0.0  
**Status:** Approved for Implementation (Phase 1 Final)  
**Author:** Senior Full-Stack Software Architect  

---

## 1. Role Taxonomy & Three-Track Reconciliation

The platform reconciles the **Three Primary User Tracks** with **Six Granular System Roles**:

```
+---------------------------------------------------------------------------------------------------+
| 3 PRIMARY TRACKS           6 GRANULAR SYSTEM ROLES (RBAC)                                         |
+---------------------------------------------------------------------------------------------------+
| 1. ADMIN TRACK       ──►   SUPER_ADMIN (Full system governance, audit logs, user provisioning)    |
|                                                                                                   |
| 2. HR & TALENT TRACK ──┬►  HR_MANAGER (Full requisition lifecycle, offer approvals, onboarding)   |
|                        ├►  RECRUITER (Pipeline management, candidate triage, interview booking)   |
|                        ├►  HIRING_MANAGER (Department opening approvals, panel reviews)           |
|                        └►  INTERVIEWER (Assigned interview conduct, scorecard submissions)        |
|                                                                                                   |
| 3. CANDIDATE TRACK   ──►   CANDIDATE (Career portal application, stage tracking, e-signing)       |
+---------------------------------------------------------------------------------------------------+
```

| Primary Track | System Role (`RoleType`) | Role Display Name | Scope of Authority & Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `SUPER_ADMIN` | Super Administrator | Global administrative authority over all entities, security settings, organization departments, user role assignments, and immutable audit logs. |
| **HR & Talent** | `HR_MANAGER` | Human Resources Manager | Full operational authority over talent acquisition: job creation, candidate screening, pipeline management, interview setup, offer generation, onboarding verification, and analytics. |
| | `RECRUITER` | Talent Recruiter | Day-to-day candidate sourcing, application screening, interview scheduling, candidate communications, and offer drafting. |
| | `HIRING_MANAGER` | Department Hiring Manager | Requisition requirement definition, shortlisting candidates, participating in interview panels, reviewing aggregated scorecards, and approving offer parameters. |
| | `INTERVIEWER` | Technical / Panel Interviewer | Accessing candidate profiles and resumes for assigned interviews, conducting evaluations, and submitting structured scorecards. |
| **Candidate** | `CANDIDATE` | Job Applicant | Self-service candidate portal access: applying for open requisitions, managing candidate profile, tracking application stages, e-signing offers, and submitting onboarding proofs. |

---

## 2. Comprehensive Resource-Action Permission Matrix

**Legend:**
* **`FULL`**: Unrestricted authority across all records.
* **`OWN`**: Permitted strictly on resources owned by or assigned directly to the user.
* **`DEPT`**: Permitted strictly on resources belonging to the user's assigned department.
* **`READ`**: Read-only access.
* **`NONE`**: Explicitly forbidden.

| Domain Resource | Action / Capability | `SUPER_ADMIN` | `HR_MANAGER` | `RECRUITER` | `HIRING_MANAGER` | `INTERVIEWER` | `CANDIDATE` |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **System Governance** | Manage System Settings | `FULL` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` |
| | View Immutable Audit Logs | `FULL` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` |
| | User Role Provisioning | `FULL` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` |
| **Department Management**| Create / Edit Departments | `FULL` | `READ` | `READ` | `NONE` | `NONE` | `NONE` |
| **Job Requisitions** | Create Job Draft | `FULL` | `FULL` | `FULL` | `DEPT` | `NONE` | `NONE` |
| | Approve / Publish Requisition | `FULL` | `FULL` | `NONE` | `DEPT` | `NONE` | `NONE` |
| | Edit Active Job | `FULL` | `FULL` | `FULL` | `DEPT` | `NONE` | `NONE` |
| | Close / Archive Job | `FULL` | `FULL` | `FULL` | `DEPT` | `NONE` | `NONE` |
| | View Public Active Jobs | `FULL` | `FULL` | `FULL` | `FULL` | `FULL` | `FULL` |
| **Candidate Applications**| Submit New Application | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `FULL` |
| | View All Applications | `FULL` | `FULL` | `FULL` | `DEPT` | `NONE` | `OWN` |
| | Advance Pipeline Stage | `FULL` | `FULL` | `FULL` | `DEPT` | `NONE` | `NONE` |
| | Reject Candidate | `FULL` | `FULL` | `FULL` | `DEPT` | `NONE` | `NONE` |
| | Withdraw Application | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `OWN` |
| **Resumes & Documents** | Upload Resume | `FULL` | `FULL` | `FULL` | `NONE` | `NONE` | `OWN` |
| | View / Stream Resume | `FULL` | `FULL` | `FULL` | `DEPT` | `OWN` | `OWN` |
| | Delete Resume | `FULL` | `FULL` | `NONE` | `NONE` | `NONE` | `NONE` |
| **Candidate Notes** | Add Public Internal Note | `FULL` | `FULL` | `FULL` | `FULL` | `OWN` | `NONE` |
| | Add Private Note | `FULL` | `FULL` | `OWN` | `OWN` | `NONE` | `NONE` |
| | Read Candidate Notes | `FULL` | `FULL` | `FULL` | `DEPT` | `OWN` | `NONE` |
| **Interview Management** | Schedule Interview | `FULL` | `FULL` | `FULL` | `DEPT` | `NONE` | `NONE` |
| | Reschedule / Cancel Round | `FULL` | `FULL` | `FULL` | `DEPT` | `NONE` | `NONE` |
| | View Assigned Interviews | `FULL` | `FULL` | `FULL` | `FULL` | `OWN` | `OWN` |
| **Scorecards** | Submit Evaluation Scorecard | `FULL` | `FULL` | `FULL` | `OWN` | `OWN` | `NONE` |
| | Read Aggregate Scorecards | `FULL` | `FULL` | `FULL` | `DEPT` | `OWN` | `NONE` |
| | Unlock Submitted Scorecard | `FULL` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` |
| **Job Offers** | Draft Offer Letter | `FULL` | `FULL` | `FULL` | `NONE` | `NONE` | `NONE` |
| | Approve Offer Letter | `FULL` | `FULL` | `NONE` | `DEPT` | `NONE` | `NONE` |
| | Dispatch Offer to Candidate| `FULL` | `FULL` | `FULL` | `NONE` | `NONE` | `NONE` |
| | Digital Sign / Accept Offer| `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `OWN` |
| | Decline Offer | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `OWN` |
| | Revoke Offer | `FULL` | `FULL` | `NONE` | `NONE` | `NONE` | `NONE` |
| **Onboarding** | View Onboarding Checklist | `FULL` | `FULL` | `FULL` | `DEPT` | `NONE` | `OWN` |
| | Upload Verification Tasks | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `OWN` |
| | Verify / Reject Submitted Task | `FULL` | `FULL` | `FULL` | `NONE` | `NONE` | `NONE` |
| | Finalize Hire (`HIRED`) | `FULL` | `FULL` | `NONE` | `NONE` | `NONE` | `NONE` |
| **Analytics & Reporting** | View Analytics Dashboard | `FULL` | `FULL` | `READ` | `DEPT` | `NONE` | `NONE` |
| | Export CSV Data | `FULL` | `FULL` | `NONE` | `NONE` | `NONE` | `NONE` |

---

## 3. Ownership-Based & Contextual Guard Rules (ABAC)

Beyond static role checks, the system enforces Attribute-Based Access Control (ABAC) invariants:

1. **Candidate Boundary Invariant:** A user with role `CANDIDATE` can only access `Application`, `Resume`, `JobOffer`, and `OnboardingWorkflow` records where `candidateId == req.user.id`. Any attempt to query another candidate's identifier returns a `403 Forbidden` response.
2. **Interviewer Assignment Invariant:** An `INTERVIEWER` can only access the candidate profile, resume, and scorecard submission form for interviews where their ID appears in `InterviewParticipant` for that specific interview record.
3. **Scorecard Immutability Invariant:** Once an `InterviewScorecard` is submitted (`isLocked: true`), neither the author nor recruiters can modify the scores or qualitative comments. Only a `SUPER_ADMIN` can unlock a scorecard, generating a mandatory `AuditLog` entry detailing the operational justification.
4. **Offer Approval Hierarchy Invariant:** A recruiter cannot approve their own drafted offer letter if organizational segregation of duties is enabled; approval requires an actor with `HIRING_MANAGER` (for the job's department) or `SUPER_ADMIN` authority.

---

## 4. Middleware Implementation Pattern (Express.js)

```javascript
// src/middlewares/rbac.middleware.js

/**
 * Validates that authenticated user has at least one of the permitted roles
 * @param  {...string} permittedRoles
 */
const requireRoles = (...permittedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication session required.'
        }
      });
    }

    const hasRole = req.user.roles.some((role) => permittedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Requires one of: [${permittedRoles.join(', ')}]`
        }
      });
    }

    next();
  };
};

/**
 * Enforces ownership or administrative bypass
 * @param {Function} resourceOwnerIdExtractor
 */
const requireOwnershipOrAdmin = (resourceOwnerIdExtractor) => {
  return async (req, res, next) => {
    const ownerId = await resourceOwnerIdExtractor(req);
    const isSuperAdmin = req.user.roles.includes('SUPER_ADMIN');
    const isHR = req.user.roles.includes('HR_MANAGER');
    const isOwner = req.user.id === ownerId;

    if (isSuperAdmin || isHR || isOwner) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN_OWNERSHIP',
        message: 'You are not authorized to modify this resource.'
      }
    });
  };
};

module.exports = { requireRoles, requireOwnershipOrAdmin };
```
