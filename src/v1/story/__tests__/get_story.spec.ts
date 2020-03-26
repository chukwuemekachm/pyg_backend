import 'dotenv/config';
import request from 'supertest';
import { getRepository } from 'typeorm';
import app from '../../../app';
import users from '../../../database/seed/user';
import { User } from '../../../database/entities/User';
import { Story } from '../../../database/entities/Story';
import { generateToken } from '../../shared/utils';

const agent = request.agent(app);
let token: string;
let adminToken: string;
let storyId: string;
const fakeStoryId = '3e082997-7c05-485b-afd3-bf56fbde6a48';
let _story: Story;

beforeAll(done => {
  app.on('SETUP', async () => {
    const user = await getRepository(User).findOne({ where: { email: users[0].email } });
    const adminUser = await getRepository(User).findOne({ where: { email: users[1].email } });
    const [story] = await getRepository(Story).find();
    _story = story;
    storyId = story.id;
    token = generateToken({ id: user.id, role: users[0].role });
    adminToken = generateToken({ id: adminUser.id, role: users[1].role });
    done();
  });
});

describe('Story service GET /api/v1/story/:storyId (preview story details)', () => {
  test('should return a 401 error response when user is not authenticated', async () => {
    const { status, body } = await agent.get(`/api/v1/story/${storyId}`);
    expect(status).toEqual(401);
    expect(body.message).toEqual('Needs Authentication');
  });

  test('should return a 401 when user is authenticated but not an Admin', async () => {
    const { status, body } = await agent.get(`/api/v1/story/${storyId}`).set('Authorization', `Bearer ${token}`);

    expect(status).toEqual(401);
    expect(body.message).toEqual('Un-authorized');
  });

  test('should return a 404 when user story does not exist', async () => {
    const { status, body } = await agent
      .get(`/api/v1/story/${fakeStoryId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(status).toEqual(404);
    expect(body.message).toEqual(`Story with id: ${fakeStoryId} not found`);
  });

  test('should return a 200 when user story exist', async () => {
    const { status, body } = await agent.get(`/api/v1/story/${storyId}`).set('Authorization', `Bearer ${adminToken}`);

    expect(status).toEqual(200);
    expect(body.story.summary).toEqual(_story.summary);
    expect(body.story.type).toEqual(_story.type);
    expect(body.story.cost).toEqual(_story.cost);
    expect(body.story.complexity).toEqual(_story.complexity);
    expect(Array.isArray(body.story.history)).toEqual(true);
    expect(typeof body.story.createdBy).toEqual('object');
    expect(body.story.createdBy.firstName).toEqual(users[0].firstName);
    expect(body.story.createdBy.lastName).toEqual(users[0].lastName);
    expect(body.story.createdBy.email).toEqual(users[0].email);
  });
});
