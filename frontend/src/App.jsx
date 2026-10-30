import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { RecruitmentProvider } from './context/RecruitmentContext';

// Layouts
import CandidateLayout from './layouts/CandidateLayout';
import HRLayout from './layouts/HRLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import LandingPage from './pages/LandingPage';
import JobsPage from './pages/JobsPage';
import CandidatePortalPage from './pages/CandidatePortalPage';
import HRPipelinePage from './pages/HRPipelinePage';
import JobRequisitionsPage from './pages/JobRequisitionsPage';
import CandidateDirectoryPage from './pages/CandidateDirectoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import WorkspaceModulePlaceholder from './pages/WorkspaceModulePlaceholder';
import NotFoundPage from './pages/NotFoundPage';

export function App() {
  return (
    <ThemeProvider>
      <RecruitmentProvider>
        <BrowserRouter>
          <Routes>
            {/* Public & Candidate Experience Routes */}
            <Route element={<CandidateLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/portal" element={<CandidatePortalPage />} />
            </Route>

            {/* HR & Talent Operations Routes */}
            <Route path="/hr" element={<HRLayout />}>
              <Route index element={<Navigate to="/hr/pipeline" replace />} />
              <Route path="pipeline" element={<HRPipelinePage />} />
              <Route path="jobs" element={<JobRequisitionsPage />} />
              <Route path="candidates" element={<CandidateDirectoryPage />} />
              <Route
                path="interviews"
                element={
                  <WorkspaceModulePlaceholder
                    title="Interview Coordination"
                    subtitle="Synchronize interviewer schedules, meeting links, and calendar invites."
                    category="Talent Workspace"
                    moduleKey="MOD-INTERVIEW-SCHED"
                    plannedFeatures={[
                      'Nodemailer RFC 5545 iCalendar (.ics) dispatch',
                      'Meeting URL generator (Meet, Zoom, Teams)',
                      'Structured evaluation scorecards (1-5 rating)',
                      'Immutable scorecard submission locking',
                    ]}
                    returnPath="/hr/pipeline"
                  />
                }
              />
              <Route
                path="offers"
                element={
                  <WorkspaceModulePlaceholder
                    title="Offer Letters"
                    subtitle="Draft, approve, and execute legally binding digital offer agreements."
                    category="Talent Workspace"
                    moduleKey="MOD-OFFER-LETTERS"
                    plannedFeatures={[
                      'Dynamic compensation & start date templates',
                      'Internal hiring manager approval chains',
                      'Candidate digital e-signature acceptance (IP & timestamp)',
                      'Automatic offer expiration tracking',
                    ]}
                    returnPath="/hr/pipeline"
                  />
                }
              />
              <Route
                path="onboarding"
                element={
                  <WorkspaceModulePlaceholder
                    title="Onboarding Verification"
                    subtitle="Manage post-offer document collection and employee provisioning."
                    category="Talent Workspace"
                    moduleKey="MOD-ONBOARDING"
                    plannedFeatures={[
                      'Automated post-offer checklist creation',
                      'Government ID & educational proof verification',
                      'Task rejection & candidate re-upload workflow',
                      'Final "Complete Hire" transition trigger',
                    ]}
                    returnPath="/hr/pipeline"
                  />
                }
              />
            </Route>

            {/* Admin Governance Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminDashboardPage />} />
              <Route
                path="audit"
                element={
                  <WorkspaceModulePlaceholder
                    title="Audit Trail Logs"
                    subtitle="Immutable record of system security events, role escalations, and status transitions."
                    category="Admin Console"
                    moduleKey="MOD-SYSTEM-AUDIT"
                    plannedFeatures={[
                      'Immutable database audit logging',
                      'Actor ID, client IP, and user-agent tracking',
                      'Sensitive salary change detection',
                      'CSV compliance export engine',
                    ]}
                    returnPath="/admin"
                    returnLabel="Back to Admin Console"
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <WorkspaceModulePlaceholder
                    title="Global Settings"
                    subtitle="Configure organization departments, SMTP mail transports, and password policies."
                    category="Admin Console"
                    moduleKey="MOD-GLOBAL-CONFIG"
                    plannedFeatures={[
                      'Department code configuration',
                      'Nodemailer SMTP relay credentials',
                      'Brute-force lockout thresholds',
                      'Session duration & cookie security parameters',
                    ]}
                    returnPath="/admin"
                    returnLabel="Back to Admin Console"
                  />
                }
              />
            </Route>

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </RecruitmentProvider>
    </ThemeProvider>
  );
}

export default App;
