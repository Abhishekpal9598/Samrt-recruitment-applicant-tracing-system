import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import { ArrowLeft, Clock, FileCode, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WorkspaceModulePlaceholder = ({
  title,
  subtitle,
  category = 'Talent Workspace',
  moduleKey,
  plannedFeatures = [],
  returnPath = '/hr/pipeline',
  returnLabel = 'Back to Pipeline',
}) => {
  return (
    <PageContainer
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: category, href: returnPath },
        { label: title },
      ]}
      actions={
        <Link to={returnPath}>
          <Button variant="secondary" size="sm" leftIcon={ArrowLeft}>
            {returnLabel}
          </Button>
        </Link>
      }
    >
      <div className="max-w-4xl space-y-6">
        {/* Module Status Card */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-subtle">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
              <Clock className="w-3.5 h-3.5" /> Phase 2.1 Interface Scaffolding
            </span>
            <span className="text-xs text-neutral-400 font-mono">Module: {moduleKey}</span>
          </div>

          <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
            Module Architecture & Scope Defined
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
            This module interface is defined in the system architecture specification (<span className="font-mono text-primary-600 dark:text-primary-400">docs/PRD.md</span>, <span className="font-mono text-primary-600 dark:text-primary-400">docs/TRD.md</span>). Interactive UI workflows and backend services for this module are scheduled in subsequent Phase 2 milestones.
          </p>

          <div className="rounded-md bg-neutral-50 dark:bg-neutral-850 p-4 border border-neutral-200 dark:border-neutral-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              Planned Technical Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              {plannedFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default WorkspaceModulePlaceholder;
