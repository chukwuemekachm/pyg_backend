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
    const user = await getRepository(User).findOne({ where: { email: users[0].email } });
    token = generateToken({ id: user.id, role: users[0].role });
    done();
  });
});

describe('Story service POST /api/v1/story (create story)', () => {
  test('should return a 401 error response when user is not authenticated', async () => {
    const { status, body } = await agent.post('/api/v1/story');
    expect(status).toEqual(401);
    expect(body.message).toEqual('Needs Authentication');
  });

  test('should return a 400 when inputs fail validation', async () => {
    const { status, body } = await agent.post('/api/v1/story').set('Authorization', `Bearer ${token}`);
    expect(status).toEqual(400);
    expect(body.message).toEqual('Some field(s) are failing validation');
    expect(typeof body.errors).toEqual('object');
    expect(Array.isArray(body.errors.summary)).toEqual(true);
    expect(Array.isArray(body.errors.cost)).toEqual(true);
    expect(Array.isArray(body.errors.estimatedCompletionTime)).toEqual(true);
  });

  test('should return a 201 when user is authenticated and inputs are valid', async () => {
    const estimatedCompletionTime = new Date().toISOString();
    const { status, body } = await agent
      .post('/api/v1/story')
      .set('Authorization', `Bearer ${token}`)
      .send({
        summary: 'My Test story',
        cost: '390.5',
        estimatedCompletionTime,
      });
    expect(status).toEqual(201);
    expect(body.message).toEqual('Story creation success');
    expect(typeof body.story).toEqual('object');
    expect(body.story.summary).toEqual('My Test story');
    expect(body.story.cost).toEqual(390.5);
    expect(body.story.estimatedCompletionTime).toEqual(estimatedCompletionTime);
  });
});
