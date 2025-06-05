const request = require('supertest');
const mongoose = require('mongoose');
const mockingoose = require('mockingoose');

let app, User, Post;

beforeAll(() => {
  process.env.SKIP_DB_CONNECT = '1';
  ({ app, User, Post } = require('../server'));
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('API', () => {
  const user = { username: 'alice', password: 'pass' };
  let token;

  test('register user', async () => {
    const hashed = await require('bcryptjs').hash(user.password, 10);
    mockingoose(User).toReturn({ _id: '1', username: user.username, password: hashed }, 'save');
    const res = await request(app).post('/api/register').send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe(user.username);
  });

  test('login user', async () => {
    const hashed = await require('bcryptjs').hash(user.password, 10);
    mockingoose(User).toReturn({ _id: '1', username: user.username, password: hashed }, 'findOne');
    const res = await request(app).post('/api/login').send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('create and fetch posts', async () => {
    const content = 'Hello world';
    mockingoose(Post).toReturn({ _id: '2', author: user.username, content }, 'save');
    await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content })
      .expect(200);

    mockingoose(Post).toReturn([{ _id: '2', author: { username: user.username }, content }], 'find');
    const res = await request(app)
      .get('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].content).toBe(content);
  });
});
