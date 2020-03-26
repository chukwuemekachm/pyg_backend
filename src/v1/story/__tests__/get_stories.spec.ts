import 'dotenv/config';
import request from 'supertest';
import { getRepository } from 'typeorm';
import app from '../../../app';
import users from '../../../database/seed/user';
import { User } from '../../../database/entities/User';
import { generateToken } from '../../shared/utils';

const agent = request.agent(app);
let token: string;

beforeAll(done => {
  app.on('SETUP', async () => {
    const user = await getRepository(User).findOne({ where: { email: users[1].email } });
    token = generateToken({ id: user.id, role: users[1].role });
    done();
  });
});

describe('Story service GET /api/v1/story (get all stories by me or all on platform for admin)', () => {
  test('should return a 401 error response when user is not authenticated', async () => {
    const { status, body } = await agent.get('/api/v1/story');
    expect(status).toEqual(401);
    expect(body.message).toEqual('Needs Authentication');
  });

  test('should return a 200 when user is authenticated and list of stories', async () => {
    const { status, body } = await agent.get('/api/v1/story').set('Authorization', `Bearer ${token}`);

    expect(status).toEqual(200);
    expect(Array.isArray(body.stories)).toEqual(true);
  });
});
