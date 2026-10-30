import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { z } from 'zod';
import { validateRequest } from '../src/middleware/validate.js';
import { errorHandler } from '../src/middleware/errorHandler.js';

describe('Request Validation Middleware (Zod)', () => {
  const app = express();
  app.use(express.json());

  const testSchema = z.object({
    title: z.string().min(3),
    department: z.string().min(2),
    minSalary: z.number().positive(),
  });

  app.post(
    '/test-validate',
    validateRequest({ body: testSchema }),
    (req, res) => {
      res.status(200).json({ success: true, received: req.body });
    }
  );

  app.use(errorHandler);

  it('passes validation when request body conforms to schema', async () => {
    const res = await request(app)
      .post('/test-validate')
      .send({
        title: 'Senior Engineer',
        department: 'Engineering',
        minSalary: 120000,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.received.title).toBe('Senior Engineer');
  });

  it('rejects invalid payload with 400 Bad Request and standard error details', async () => {
    const res = await request(app)
      .post('/test-validate')
      .send({
        title: 'ab', // min is 3
        department: '', // min is 2
        minSalary: -500, // must be positive
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_FAILED');
    expect(Array.isArray(res.body.error.details)).toBe(true);
    expect(res.body.error.details.length).toBeGreaterThanOrEqual(2);
  });
});
