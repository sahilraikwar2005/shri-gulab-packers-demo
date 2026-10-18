const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const request = require('supertest');

const DATA_DIR = path.join(__dirname, '..', '.test-data');
process.env.DATA_DIR = DATA_DIR;
process.env.STORAGE_DRIVER = 'json';
process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';
process.env.CORS_ORIGINS = 'http://localhost:5173';

const db = require('../src/storage/jsonDb');
const app = require('../src/app');

beforeAll(async () => {
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
  await db.create('adminUsers', {
    name: 'Test Admin', email: 'test@admin.com', passwordHash: await bcrypt.hash('pass123', 10),
    role: 'superadmin', permissions: ['*'], isActive: true,
  });
  await db.create('siteSettings', { key: 'global', companyName: 'Test Co', phone: '123', phones: ['123'], email: 'a@b.com' });
});

afterAll(() => {
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
});

describe('API', () => {
  let agent;
  beforeAll(() => { agent = request.agent(app); });

  it('health ok', async () => {
    const res = await agent.get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('login succeeds', async () => {
    const res = await agent.post('/api/v1/auth/login').send({ email: 'test@admin.com', password: 'pass123' });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('test@admin.com');
  });

  it('settings returns data', async () => {
    const res = await agent.get('/api/v1/settings');
    expect(res.status).toBe(200);
    expect(res.body.data.companyName).toBe('Test Co');
  });

  it('service CRUD works', async () => {
    const create = await agent.post('/api/v1/services').send({ title: 'Packing (Test)', slug: 'packing-test', isPublished: true });
    expect(create.status).toBe(201);
    const id = create.body.data._id;
    const list = await agent.get('/api/v1/services');
    expect(list.body.data.length).toBe(1);
    const upd = await agent.put(`/api/v1/services/${id}`).send({ title: 'Packing Updated' });
    expect(upd.status).toBe(200);
    expect(upd.body.data.title).toBe('Packing Updated');
    const del = await agent.delete(`/api/v1/services/${id}`);
    expect(del.status).toBe(200);
    const list2 = await agent.get('/api/v1/services');
    expect(list2.body.data.length).toBe(0);
  });

  it('public inquiry creation and admin list work', async () => {
    const create = await request(app).post('/api/v1/inquiries').send({
      movingType: 'home', shipmentType: 'local',
      pickup: { city: 'Bhopal' }, destination: { city: 'Indore' },
      customer: { name: 'Alice', mobile: '9000000000' },
    });
    expect(create.status).toBe(201);
    expect(create.body.referenceId).toBeTruthy();
    const list = await agent.get('/api/v1/inquiries');
    expect(list.body.pagination.total).toBe(1);
    const id = list.body.data[0]._id;
    const upd = await agent.put(`/api/v1/inquiries/${id}`).send({ status: 'contacted', notes: 'called' });
    expect(upd.status).toBe(200);
    expect(upd.body.data.status).toBe('contacted');
    expect(Array.isArray(upd.body.data.notes)).toBe(true);
  });
});