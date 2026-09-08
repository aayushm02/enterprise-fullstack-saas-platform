import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server';

describe('NexusPulse Enterprise API Integration Test Suite', () => {
  let authToken = '';

  it('GET /api/v1/health - should return 200 HEALTHY status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('HEALTHY');
  });

  it('POST /api/v1/auth/login - should authenticate admin and return JWT payload', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@enterprise.com',
        password: 'Admin@12345'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('ADMIN');

    authToken = res.body.data.token;
  });

  it('GET /api/v1/incidents - should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/v1/incidents');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/incidents - should return incident inventory for authenticated tenant', async () => {
    const res = await request(app)
      .get('/api/v1/incidents')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  it('POST /api/v1/ai/investigate - should trigger Multi-Agent pipeline (Triage, Diagnosis, Mitigation)', async () => {
    const res = await request(app)
      .post('/api/v1/ai/investigate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        incidentId: 'inc_101'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.steps.length).toBe(3);
    expect(res.body.data.steps[0].agentName).toBe('TriageAgent');
    expect(res.body.data.steps[1].agentName).toBe('DiagnosisAgent');
    expect(res.body.data.steps[2].agentName).toBe('MitigationAgent');
    expect(res.body.data.confidenceScore).toBeGreaterThan(0.7);
  });

  it('POST /api/v1/ai/rag/query - should perform semantic retrieval from runbooks', async () => {
    const res = await request(app)
      .post('/api/v1/ai/rag/query')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: 'payment gateway redis timeout latency'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.data[0].doc.title).toContain('Payment');
  });
});
