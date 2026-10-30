import PageContainer from '../components/common/PageContainer';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '../components/common/Table';
import { Shield, Users, Database, AlertCircle, Info } from 'lucide-react';

const SIMULATED_STAFF_USERS = [
  { id: 'usr-1', name: 'Sarah Jenkins', email: 'sarah.admin@smartats.io', role: 'SUPER_ADMIN', status: 'Configured' },
  { id: 'usr-2', name: 'Marcus Vance', email: 'marcus.hr@smartats.io', role: 'HR_MANAGER', status: 'Configured' },
  { id: 'usr-3', name: 'David Chen', email: 'david.eng@smartats.io', role: 'HIRING_MANAGER', status: 'Configured' },
  { id: 'usr-4', name: 'Elena Rostova', email: 'elena.tech@smartats.io', role: 'INTERVIEWER', status: 'Configured' },
];

export const AdminDashboardPage = () => {
  return (
    <PageContainer
      title="System Administration & Governance"
      subtitle="Manage global organizational settings, user provisioning, and security audit logs."
      breadcrumbs={[
        { label: 'Admin Console', href: '/admin' },
        { label: 'System Overview' },
      ]}
      actions={
        <Button
          size="sm"
          leftIcon={Users}
          onClick={() => alert('User invitation workflow scheduled for Phase 2.2')}
        >
          Invite Staff User
        </Button>
      }
    >
      {/* Demonstration & Data Integrity Notice */}
      <div className="mb-6 p-4 rounded-lg border border-warning-200 dark:border-warning-900 bg-warning-50/60 dark:bg-warning-950/30 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-semibold text-warning-800 dark:text-warning-300">
            Frontend Demonstration Mode — Data Integrity Notice
          </p>
          <p className="text-warning-700 dark:text-warning-400 mt-0.5 leading-relaxed">
            The status cards and user allocations displayed below represent static frontend prototype fixtures. Real-time service telemetry, active session counts, and live audit logging require backend Express API and PostgreSQL database integration (Phase 2.2).
          </p>
        </div>
      </div>

      {/* Honest Status & Architecture Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Service Telemetry
            </p>
            <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning-500"></span> Telemetry Offline
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Backend disconnected (Phase 2.1)
            </p>
          </div>
          <div className="p-2.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Staff Directory
            </p>
            <p className="text-sm font-bold text-neutral-900 dark:text-white mt-1">
              4 Configured Accounts
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Live sessions unmonitored
            </p>
          </div>
          <div className="p-2.5 rounded-md bg-primary-50 dark:bg-primary-950/60 text-primary-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Security Standard
            </p>
            <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mt-1">
              TLS 1.3 & JWT Cookie Specs
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Target architectural design
            </p>
          </div>
          <div className="p-2.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* User Provisioning Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Configured Role Allocations (Simulated Fixture)</span>
            <span className="text-[11px] font-normal text-neutral-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Static Directory
            </span>
          </h3>
        </div>

        <Table className="min-w-[600px]">
          <TableHeader>
            <tr>
              <TableHead>User Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Assigned System Role</TableHead>
              <TableHead>Directory Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {SIMULATED_STAFF_USERS.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-semibold">{u.name}</TableCell>
                <TableCell className="font-mono text-xs">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="primary" size="sm">
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="neutral" size="sm" dot>
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert(`Permissions modal for ${u.name} scheduled for Phase 2.2`)}
                  >
                    Edit Permissions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
};

export default AdminDashboardPage;
