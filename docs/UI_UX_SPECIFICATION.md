# UI/UX Specification (UI_UX_SPECIFICATION)

## Smart Recruitment & Applicant Tracking System (ATS)

**Document Version:** 2.0.0  
**Status:** Approved Engineering Standard  
**Product Category:** Enterprise B2B HR Tech SaaS  
**Design Inspiration Archetypes:** Linear (data density, keyboard efficiency, subtle micro-interactions), Ashby (deep recruitment data modeling, candidate-centric workflows), Lever (clean pipeline velocity, collaborative scorecard interfaces)  

---

## 1. Product Design Philosophy & Visual Identity

### 1.1 Core Design Principles
The Smart Recruitment & ATS user interface is engineered to reflect a premier, commercial-grade enterprise recruitment application. It explicitly rejects amateur tropes, generic AI dashboard templates, and consumer-toy aesthetics in favor of high-performance workplace efficiency.

1. **Information Density with Breathing Room:** Recruitment professionals evaluate hundreds of candidate attributes hourly. The UI must present comprehensive information in compact, legible data tables and kanban views without cognitive overload or visual clutter.
2. **Predictable & Restrained Visual Hierarchy:** Typography, border lines, and subtle background tonality guide the eye. Visual hierarchy is established through contrast and weight rather than decorative elements or heavy drop shadows.
3. **Purpose-Built Workspaces for Each Role:**
   * **Admin Experience:** Governance-focused, dense, audit-ready, system health and user permission management.
   * **HR & Recruiter Experience:** Velocity-focused, drag-and-drop pipelines, inline resume preview drawers, fast triage shortcuts.
   * **Candidate Experience:** Reassuring, clear, frictionless, mobile-optimized, single-column focus with zero ambiguity about status.
4. **Intentional Transitions & Micro-Interactions:** Animations exist solely to reinforce spatial mental models (e.g., slide-out candidate detail drawers, drag-and-drop pipeline card snaps, tab indicators). Animations are capped at 150–200ms with ease-out timing.

### 1.2 Anti-Patterns & Explicit Design Constraints
The following anti-patterns are strictly prohibited across all frontend components:
* ❌ **No Generic AI Dashboard Aesthetics:** No arbitrary gradient card borders, purple/neon glow effects, or decorative radial gradients.
* ❌ **No Unnecessary Glassmorphism:** No frosted-glass panels (`backdrop-blur`) that degrade contrast or readability.
* ❌ **No Repetitive Metric Cards:** Avoid 4 identical stat cards with generic trend lines at the top of every screen. Metrics must be contextual and actionable.
* ❌ **No Fake Statistics or Non-Functional Widgets:** Every graph, badge, and counter must map directly to real PostgreSQL aggregate queries.
* ❌ **No Placeholder Content:** UI components must display graceful empty states with clear calls-to-action (e.g., "No candidates currently in Screening stage. Sourced candidates will appear here.") rather than static "Lorem Ipsum" or fake hardcoded cards.

---

## 2. Layout Architecture & Workspace Layouts

The application provides three distinct layout shells tailored to user persona needs:

```
+---------------------------------------------------------------------------------------+
| HR / ADMIN WORKSPACE LAYOUT                                                           |
| +-----------------------------------------------------------------------------------+ |
| | Top Bar: Workspace Switcher | Search (Cmd+K) | Global Quick Actions | Profile Menu | |
| +-----------------------------------------------------------------------------------+ |
| | Collapsible | Main Content Area                                                   | |
| | Navigation  | - Header: Breadcrumbs, Title, View Switcher (Kanban/List), Actions  | |
| | Sidebar     | - Active Filter Bar: Department, Role, Recruiter, Date Range        | |
| |             | - Primary Work Surface (Data Table / Kanban Pipeline)               | |
| | - Jobs      |                                                                     | |
| | - Candidates|                                                                     | |
| | - Pipeline  |                                                                     | |
| | - Calendar  |                                                                     | |
| | - Analytics |                                                                     | |
| | - Settings  | [Slide-over Detail Drawer: Candidate Profile + Resume + Scorecard]  | |
| +-----------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------+
```

### 2.1 Workspace 1: Admin & HR Operations Layout
* **Top Navigation Bar (Height: 56px):**
  * Organization identifier and environment indicator.
  * Universal command search (`Ctrl/Cmd + K`) for instant jumping to candidates, jobs, or settings.
  * Direct notification center (interview updates, pending scorecards).
  * User profile menu with light/dark theme toggle and session controls.
* **Collapsible Left Sidebar (Width: 240px expanded, 64px collapsed):**
  * Grouped navigation: **Talent Acquisition** (Jobs, Candidates, Pipelines, Interviews), **Workforce** (Offers, Onboarding), and **Administration** (Team, Departments, Audit Logs, Settings).
  * Active item indicator with high-contrast accent bar and subtle background tint.
* **Contextual Work Surface:**
  * Header bar with breadcrumb trails, view switchers (Kanban vs. Tabular List vs. Split View), and primary CTAs.
  * Slide-Over Detail Drawer (Width: 640px / 45vw): Allows recruiters to review resumes, leave candidate notes, and inspect scorecards without navigating away from the active pipeline.

### 2.2 Workspace 2: Candidate Portal Layout
* **Layout Structure:** Centered single-column container (Max-width: 1024px) optimized for clarity, accessibility, and high mobile completion rates.
* **Top Bar (Height: 56px):** Clean organization branding, "Explore Jobs", and "My Applications" tabs, plus authenticated profile menu.
* **Application Tracker Surface:** Visual progress tracker displaying discrete milestone states (`Submitted` -> `In Review` -> `Interview Scheduled` -> `Offer` -> `Onboarding`).
* **Onboarding Checklist:** Clean task cards with clear status pills (`Pending Upload`, `Under Review`, `Verified`, `Action Needed`).

---

## 3. Core Recruitment UI Interfaces

### 3.1 Recruitment Pipeline (Kanban Board)
* **Columns:** Represent application stages (`APPLIED`, `SCREENING`, `INTERVIEW_SCHEDULED`, `INTERVIEW_COMPLETED`, `OFFERED`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`).
* **Column Header:** Stage title, total candidate badge, stage SLA counter (e.g., "Avg 3.2 days"), and quick sort options.
* **Candidate Card:**
  * Candidate full name (font-weight: 600) with avatar/initials.
  * Applied position and department.
  * Time in current stage (color-coded badge if exceeding SLA target).
  * Key qualification indicators (tags: e.g., "PostgreSQL", "React", "10y exp").
  * Next action badge (e.g., "Interview Tomorrow 2:00 PM", "Scorecard Pending").
  * Recruiter assignment avatar.
* **Drag-and-Drop Interaction:**
  * Dragging lifts card with a subtle 4px elevation shadow and 1-degree rotation.
  * Target column highlights with a subtle dashed border and background tint.
  * Dropping into `REJECTED` stage triggers a confirmation modal with template email selection.

### 3.2 Candidate Table View (High-Density List)
* **Grid Specifications:** Virtualized list supporting 1,000+ candidates without DOM lag.
* **Columns:** Candidate Name, Status Pill, Applied Date, Current Stage, Interview Score (e.g., "4.5 ★"), Assigned Recruiter, Actions.
* **Inline Actions:** Quick stage movement dropdown, email candidate icon, download resume icon, add note button.
* **Batch Operations:** Checkbox selection row enabling bulk status transitions or bulk rejection emails.

### 3.3 Interview Coordination & Calendar View
* **View Modes:** Day, Week, and Agenda views.
* **Interviewer Availability Slots:** Clear visual distinction between free, busy, and ATS-scheduled slots.
* **Interview Booking Modal:**
  * Split pane: Left pane for candidate profile summary and resume preview; right pane for round type selection, datetime picker, interviewer multi-select with instant availability check, and auto-generated Google Meet / Zoom link input.
  * Calendar invite preview showing exact `.ics` payload description.

### 3.4 Structured Scorecard Evaluation Interface
* **Layout:** Two-column split-screen view:
  * Left Column (50% width): Candidate resume PDF viewer with pan/zoom and text selection.
  * Right Column (50% width): Standardized evaluation form.
* **Evaluation Criteria:**
  * Numerical rating (1 to 5 buttons) for Technical Competence, Problem Solving, System Design, Communication, and Cultural Alignment.
  * Explicit rating definitions visible on hover (e.g., "1 = Unsatisfactory, 3 = Meets Expectations, 5 = Exceptional Subject Matter Authority").
  * Recommendation Segmented Control: `STRONG_NO_HIRE` (Red), `NO_HIRE` (Amber-Red), `HIRE` (Green), `STRONG_HIRE` (Emerald).
  * Narrative feedback textarea with markdown support.
  * Sticky footer with "Save Draft" and "Submit & Lock Scorecard" buttons.

### 3.5 Offer Letter & E-Signature Interface
* **HR Builder Pane:** Form inputs for Base Salary, Performance Bonus, Equity, Start Date, Expiry Date, and customizable terms.
* **Candidate Review Pane:** Real-time preview of formatted company offer letter document.
* **Digital Signature Box:** Candidate types legal name; system generates cursive SVG signature preview, displays binding legal consent text, and captures IP/timestamp upon submission.

### 3.6 Meaningful Analytics Visualizations
* **Time-to-Hire Funnel:** Horizontal stage conversion bars displaying candidate drop-off percentage and average dwell time per stage.
* **Requisition Velocity Gauge:** Visual target indicator showing actual vs. target days to fill.
* **Interviewer SLA Compliance Matrix:** Heatmap showing average hours to submit scorecards per interviewer.

---

## 4. Theme & Accessibility Specifications

### 4.1 Theme Modes (Light & Dark)
* The system supports seamless switching between Light, Dark, and System modes.
* **Light Theme:** Crisp white background (`#FFFFFF`), subtle cool-gray borders (`#E2E8F0`), deep-slate typography (`#0F172A`), optimized for daytime high-throughput scanning.
* **Dark Theme:** Deep dark-slate background (`#0B0F17`), muted surface panels (`#131B2E`), subtle dark borders (`#1E293B`), off-white typography (`#F8FAFC`). Pure `#000000` is avoided to prevent harsh optical contrast and eye fatigue.

### 4.2 Accessibility (WCAG 2.1 AA Compliance)
* **Contrast Ratios:** Minimum 4.5:1 for standard body text; minimum 3:1 for large headers, badges, and interactive controls.
* **Keyboard Navigation:** Full focus ring visibility (`ring-2 ring-primary-500 ring-offset-2`). Every table, modal, drawer, and dropdown can be fully operated via Tab, Shift+Tab, Arrow keys, Enter, and Esc.
* **Screen Reader Semantic Markup:** Form controls have associated `<label>` tags; icons possess `aria-hidden="true"` with accompanying descriptive text or `aria-label`.
* **Reduced Motion:** Respects `prefers-reduced-motion: reduce` by disabling non-essential transitions and sliding animations.
