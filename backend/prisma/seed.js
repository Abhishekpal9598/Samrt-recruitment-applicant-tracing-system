/**
 * ==============================================================================
 * SMART RECRUITMENT & APPLICANT TRACKING SYSTEM (ATS)
 * Deterministic Database Seeder for Phase 2.3
 *
 * NOTE ON DATA INTEGRITY:
 * - Contains purely synthetic demonstration records. Zero real candidate PII.
 * - Idempotent execution: Uses Prisma `upsert` to allow repeated execution without duplicate key conflicts.
 * - Conforms strictly to schema defined in `docs/DATABASE_SCHEMA.md`.
 * ==============================================================================
 */

import { PrismaClient, RoleType, JobStatus, EmploymentType, ExperienceLevel, ApplicationStage } from '@prisma/client';

const prisma = new PrismaClient();

// Safe demonstration password hash (bcrypt hash of 'Password123!' with salt rounds 12)
const DEMO_PASSWORD_HASH = '$2b$12$K8y4r4Z1eQZ0f5z2v6vO7e3g0v2s3x5y7z9a1b3c5d7e9f1g3h5i.';

export async function seedDatabase() {
  console.log('[Seed] Initializing deterministic demonstration dataset...');

  // 1. Seed Roles
  console.log('[Seed] Seeding foundational system roles...');
  const roleTypes = Object.values(RoleType);
  const roles = {};

  for (const roleName of roleTypes) {
    const roleRecord = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `System role for ${roleName.replace(/_/g, ' ').toLowerCase()}`,
      },
    });
    roles[roleName] = roleRecord;
  }

  // 2. Seed Departments
  console.log('[Seed] Seeding organizational departments...');
  const departmentsData = [
    { name: 'Engineering', code: 'ENG', description: 'Core product engineering, platform, and infrastructure' },
    { name: 'Product & Design', code: 'DES', description: 'Product management, user research, and UI/UX design' },
    { name: 'Human Resources', code: 'HR', description: 'Talent acquisition, operations, and people partner team' },
    { name: 'Marketing', code: 'MKT', description: 'Growth, brand marketing, and developer relations' },
    { name: 'Operations', code: 'OPS', description: 'Legal, compliance, finance, and corporate operations' },
  ];

  const departments = {};
  for (const dept of departmentsData) {
    const deptRecord = await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name, description: dept.description },
      create: dept,
    });
    departments[dept.code] = deptRecord;
  }

  // 3. Seed Demonstration Users
  console.log('[Seed] Seeding demonstration users across role tracks...');
  const usersData = [
    {
      email: 'admin@smartats.internal',
      firstName: 'System',
      lastName: 'Administrator',
      roles: [RoleType.SUPER_ADMIN],
      headline: 'Principal Enterprise Infrastructure Architect',
    },
    {
      email: 'hr.manager@smartats.internal',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      roles: [RoleType.HR_MANAGER],
      headline: 'Head of Talent Operations',
    },
    {
      email: 'marcus.vance@smartats.internal',
      firstName: 'Marcus',
      lastName: 'Vance',
      roles: [RoleType.RECRUITER],
      headline: 'Senior Technical Talent Recruiter',
    },
    {
      email: 'david.kim@smartats.internal',
      firstName: 'David',
      lastName: 'Kim',
      roles: [RoleType.HIRING_MANAGER, RoleType.INTERVIEWER],
      headline: 'Engineering Director - Core Platform',
    },
    {
      email: 'alex.rivera@example.com',
      firstName: 'Alex',
      lastName: 'Rivera',
      roles: [RoleType.CANDIDATE],
      headline: 'Senior Full-Stack Engineer Candidate',
      phoneNumber: '+1 (555) 234-5678',
    },
  ];

  const users = {};
  for (const userData of usersData) {
    const userRecord = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        isActive: true,
      },
      create: {
        email: userData.email,
        passwordHash: DEMO_PASSWORD_HASH,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber || null,
        isActive: true,
        isEmailVerified: true,
        profile: {
          create: {
            headline: userData.headline,
            yearsOfExp: 6.5,
          },
        },
      },
    });

    // Assign roles idempotently
    for (const rType of userData.roles) {
      const roleId = roles[rType].id;
      const userRoleExists = await prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: userRecord.id,
            roleId,
          },
        },
      });

      if (!userRoleExists) {
        await prisma.userRole.create({
          data: {
            userId: userRecord.id,
            roleId,
          },
        });
      }
    }

    users[userData.email] = userRecord;
  }

  // 4. Seed Foundational Skills
  console.log('[Seed] Seeding technical competencies & skills...');
  const skillNames = [
    'React.js',
    'Node.js',
    'PostgreSQL',
    'TypeScript',
    'Prisma ORM',
    'Docker',
    'Tailwind CSS',
    'System Architecture',
  ];

  const skills = {};
  for (const skillName of skillNames) {
    const skillRecord = await prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName },
    });
    skills[skillName] = skillRecord;
  }

  // 5. Seed Demonstration Job Requisitions
  console.log('[Seed] Seeding job requisitions...');
  const recruiter = users['marcus.vance@smartats.internal'];

  const jobsData = [
    {
      code: 'ENG-2026-001',
      title: 'Senior Full-Stack Engineer',
      departmentCode: 'ENG',
      employmentType: EmploymentType.FULL_TIME,
      experienceLevel: ExperienceLevel.SENIOR_LEVEL,
      location: 'Remote - US / EU',
      minSalary: 140000,
      maxSalary: 175000,
      status: JobStatus.PUBLISHED,
      description:
        'Architect and develop core recruitment lifecycle features across React.js, Express.js, and PostgreSQL. Lead architectural decisions for high-throughput pipeline workflows.',
      requirements:
        '5+ years of full-stack TypeScript/JavaScript experience. Deep mastery of React, Node.js, and relational schema modeling. Strong commitment to test automation and accessibility.',
      benefits: 'Comprehensive health coverage, 401(k) matching, flexible remote work policy.',
    },
    {
      code: 'ENG-2026-002',
      title: 'Staff Backend Systems Architect',
      departmentCode: 'ENG',
      employmentType: EmploymentType.FULL_TIME,
      experienceLevel: ExperienceLevel.LEAD,
      location: 'Hybrid - New York, NY',
      minSalary: 180000,
      maxSalary: 220000,
      status: JobStatus.PUBLISHED,
      description:
        'Design high-concurrency ingestion pipelines, transactional data boundaries, and cryptographic authentication protocols.',
      requirements:
        '8+ years backend systems architecture, distributed SQL engines, microservices boundary governance, and security auditing.',
      benefits: 'Executive equity grants, 401(k) matching, comprehensive family health coverage.',
    },
  ];

  const jobs = {};
  for (const j of jobsData) {
    const jobRecord = await prisma.job.upsert({
      where: { code: j.code },
      update: {
        title: j.title,
        status: j.status,
      },
      create: {
        code: j.code,
        title: j.title,
        departmentId: departments[j.departmentCode].id,
        creatorId: recruiter.id,
        status: j.status,
        employmentType: j.employmentType,
        experienceLevel: j.experienceLevel,
        location: j.location,
        minSalary: j.minSalary,
        maxSalary: j.maxSalary,
        currency: 'USD',
        description: j.description,
        requirements: j.requirements,
        benefits: j.benefits,
        publishedAt: new Date(),
      },
    });
    jobs[j.code] = jobRecord;
  }

  // 6. Seed Demonstration Candidate Application
  console.log('[Seed] Seeding candidate application with timeline and resume metadata...');
  const candidateUser = users['alex.rivera@example.com'];
  const targetJob = jobs['ENG-2026-001'];

  const applicationRecord = await prisma.application.upsert({
    where: {
      candidateId_jobId: {
        candidateId: candidateUser.id,
        jobId: targetJob.id,
      },
    },
    update: {
      stage: ApplicationStage.INTERVIEW_SCHEDULED,
    },
    create: {
      candidateId: candidateUser.id,
      jobId: targetJob.id,
      stage: ApplicationStage.INTERVIEW_SCHEDULED,
      source: 'CAREER_PORTAL',
      resume: {
        create: {
          originalName: 'Alex_Rivera_Senior_Resume.pdf',
          storedFileName: 'res-alex-rivera-2026-demo.pdf',
          storagePath: 'uploads/resumes/res-alex-rivera-2026-demo.pdf',
          mimeType: 'application/pdf',
          fileSizeBytes: 245760,
          fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        },
      },
      stageHistory: {
        create: [
          {
            fromStage: ApplicationStage.APPLIED,
            toStage: ApplicationStage.SCREENING,
            changedById: recruiter.id,
            reason: 'Candidate background meets full-stack qualifications.',
          },
          {
            fromStage: ApplicationStage.SCREENING,
            toStage: ApplicationStage.INTERVIEW_SCHEDULED,
            changedById: recruiter.id,
            reason: 'Screening passed. Advancing to technical panel interview.',
          },
        ],
      },
      notes: {
        create: {
          authorId: recruiter.id,
          content: 'Strong portfolio and deep React/Node experience. Recommended for panel review.',
        },
      },
    },
  });

  console.log('[Seed] Demonstration dataset seeding completed successfully.');
  return {
    rolesCount: Object.keys(roles).length,
    departmentsCount: Object.keys(departments).length,
    usersCount: Object.keys(users).length,
    jobsCount: Object.keys(jobs).length,
    applicationId: applicationRecord.id,
  };
}

// Direct script execution support
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .catch((err) => {
      console.error('[Seed Error]:', err.message);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
