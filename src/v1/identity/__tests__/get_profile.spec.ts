import 'dotenv/config';
import request from 'supertest';
import app from '../../../app';
import users from '../../../database/seed/user';
import { generateToken } from '../../shared/utils';

const agent = request.agent(app);
const token = generateToken({ email: users[0].email, role: users[0].role });

beforeAll(done => {
  app.on('SETUP', () => {
    done();
  });
});

describe('Indentity Service', () => {
  test('should return a 401 error response when user is not authenticated', async () => {
    const { status, body } = await agent.get('/api/v1/identity');
    expect(status).toEqual(401);
    expect(body.message).toEqual('Needs Authentication');
  });

  test('should return a 200 when user is authenticated', async () => {
    const { status, body } = await agent.get('/api/v1/identity').set('Authorization', `Bearer ${token}`);
    expect(status).toEqual(200);
    expect(body.email).toEqual(users[0].email);
    expect(body.firstName).toEqual(users[0].firstName);
    expect(body.lastName).toEqual(users[0].lastName);
    expect(body.role).toEqual(users[0].role);
  });
});
