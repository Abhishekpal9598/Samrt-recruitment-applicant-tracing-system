import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Shield, GitBranch, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';

export const LandingPage = () => {
  return (
    <div className="py-12 sm:py-16">
      {/* Hero section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 text-xs font-semibold text-primary-700 dark:text-primary-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></span>
          Enterprise Recruitment Architecture v1.0
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
          Smart Recruitment & <br className="hidden sm:inline" />
          <span className="text-primary-600 dark:text-primary-400">Applicant Tracking System</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
          A centralized, production-grade talent acquisition platform unifying job requisitions, candidate screening, structured interview scorecards, digital offers, and onboarding.
        </p>

        {/* Quick Workspace Navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/jobs">
            <Button size="lg" rightIcon={ArrowRight}>
              Explore Open Positions
            </Button>
          </Link>
          <Link to="/hr/pipeline">
            <Button variant="secondary" size="lg" leftIcon={GitBranch}>
              HR Talent Workspace
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="outline" size="lg" leftIcon={Shield}>
              Admin Console
            </Button>
          </Link>
        </div>
      </div>

      {/* Three Primary Tracks Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-subtle hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
          <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
            Candidate Experience
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
            Frictionless job discovery, resume upload, live stage progression tracking, and digital offer letter e-signing.
          </p>
          <Link to="/portal" className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
            Open Candidate Portal <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-subtle hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
          <div className="w-10 h-10 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
            <GitBranch className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
            HR & Talent Operations
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
            Interactive multi-stage pipeline Kanban, calendar coordination, objective scorecard rubrics, and onboarding queues.
          </p>
          <Link to="/hr/pipeline" className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
            Open Candidate Pipeline <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-subtle hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
          <div className="w-10 h-10 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
            Enterprise Governance
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
            Fine-grained 6-role RBAC, security settings, user provisioning, and immutable audit logging.
          </p>
          <Link to="/admin" className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
            Open Admin Console <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="mt-16 max-w-4xl mx-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-6 sm:p-8">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4 text-center">
          Architectural Highlights
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-neutral-700 dark:text-neutral-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0" />
            <span>Strict Light & Dark Theme</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0" />
            <span>Inter Typography System</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0" />
            <span>Tailwind Enterprise Tokens</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0" />
            <span>WCAG 2.1 AA Accessibility</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0" />
            <span>Responsive 3-Tier Layouts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0" />
            <span>Zero Generic AI Dashboard Fluff</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
