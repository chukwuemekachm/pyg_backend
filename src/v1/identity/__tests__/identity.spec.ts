import 'dotenv/config';
import request from 'supertest';
import app from '../../../app';
import users from '../../../database/seed/user';

const agent = request.agent(app);

beforeAll(done => {
  app.on('SETUP', () => {
    done();
  });
});

describe('Indentity Service', () => {
  test(`should return a 401 error response when user doesn't exist`, async () => {
    const { status, body } = await agent
      .post('/api/v1/identity')
      .send({ email: 'bad@test.com', password: 'badPassword' });
    expect(status).toEqual(401);
    expect(body.message).toEqual('Invalid credentials');
  });

  test('should return a 401 when user exists but password is bad', async () => {
    const { status, body } = await agent
      .post('/api/v1/identity')
      .send({ email: users[0].email, password: 'badPassword' });
    expect(status).toEqual(401);
    expect(body.message).toEqual('Invalid credentials');
  });

  test('should return a 200 when user exists and credentials are valid', async () => {
    const { status, body } = await agent
      .post('/api/v1/identity')
      .send({ email: users[0].email, password: users[0].password });
    expect(status).toEqual(200);
    expect(body.message).toEqual('Login success');
    expect(typeof body.token).toEqual('string');
  });
});
