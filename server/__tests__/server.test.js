const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app, mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URL = mongo.getUri();
  app = require('../server');
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe('API', () => {
  const user = { username: 'alice', password: 'pass' };
  let token;

  test('register user', async () => {
    const res = await request(app).post('/api/register').send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe(user.username);
  });

  test('login user', async () => {
    const res = await request(app).post('/api/login').send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('create and fetch posts', async () => {
    const content = 'Hello world';
    await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content })
      .expect(200);

    const res = await request(app)
      .get('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].content).toBe(content);
    expect(res.body[0].author.username).toBe(user.username);
  });
});
