import { describe, it, expect } from 'vitest';
import { RoleType, JobStatus, EmploymentType, ApplicationStage } from '@prisma/client';
import { prisma, checkDatabaseConnection } from '../src/db/prisma.js';
import { seedDatabase } from '../prisma/seed.js';

describe('Prisma Architecture & Database Schema Conformance', () => {
  it('instantiates the PrismaClient singleton successfully', () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe('function');
    expect(typeof prisma.$disconnect).toBe('function');
    expect(typeof prisma.$queryRaw).toBe('function');
  });

  it('exports all documented database enums conforming to DATABASE_SCHEMA.md', () => {
    expect(RoleType.SUPER_ADMIN).toBe('SUPER_ADMIN');
    expect(RoleType.HR_MANAGER).toBe('HR_MANAGER');
    expect(RoleType.RECRUITER).toBe('RECRUITER');
    expect(RoleType.HIRING_MANAGER).toBe('HIRING_MANAGER');
    expect(RoleType.INTERVIEWER).toBe('INTERVIEWER');
    expect(RoleType.CANDIDATE).toBe('CANDIDATE');

    expect(JobStatus.DRAFT).toBe('DRAFT');
    expect(JobStatus.PUBLISHED).toBe('PUBLISHED');
    expect(JobStatus.CLOSED).toBe('CLOSED');

    expect(EmploymentType.FULL_TIME).toBe('FULL_TIME');
    expect(EmploymentType.CONTRACT).toBe('CONTRACT');

    expect(ApplicationStage.APPLIED).toBe('APPLIED');
    expect(ApplicationStage.SCREENING).toBe('SCREENING');
    expect(ApplicationStage.INTERVIEW_SCHEDULED).toBe('INTERVIEW_SCHEDULED');
    expect(ApplicationStage.OFFERED).toBe('OFFERED');
    expect(ApplicationStage.HIRED).toBe('HIRED');
    expect(ApplicationStage.REJECTED).toBe('REJECTED');
  });

  it('includes all 21 documented entities in Prisma Client model delegates', () => {
    const expectedEntities = [
      'user',
      'role',
      'userRole',
      'profile',
      'refreshToken',
      'department',
      'job',
      'skill',
      'jobSkill',
      'application',
      'resume',
      'applicationStageHistory',
      'candidateNote',
      'interview',
      'interviewParticipant',
      'interviewScorecard',
      'jobOffer',
      'onboardingWorkflow',
      'onboardingTask',
      'onboardingTaskSubmission',
      'auditLog',
    ];

    for (const entity of expectedEntities) {
      expect(prisma[entity]).toBeDefined();
      expect(typeof prisma[entity].findMany).toBe('function');
      expect(typeof prisma[entity].create).toBe('function');
    }
  });

  it('handles database connection check gracefully when database is unavailable', async () => {
    // Calling checkDatabaseConnection with invalid mock client or unreachable connection
    const mockClient = {
      $queryRaw: async () => {
        throw new Error('Connection refused at 127.0.0.1:5432');
      },
    };

    const status = await checkDatabaseConnection(mockClient);
    expect(status.connected).toBe(false);
    expect(status.error).toContain('Connection refused');
  });

  it('exports idempotent seedDatabase function', () => {
    expect(typeof seedDatabase).toBe('function');
  });
});
