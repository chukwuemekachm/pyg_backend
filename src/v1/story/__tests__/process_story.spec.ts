import 'dotenv/config';
import request from 'supertest';
import { getRepository } from 'typeorm';
import app from '../../../app';
import users from '../../../database/seed/user';
import { User } from '../../../database/entities/User';
import { Story, StoryStatus } from '../../../database/entities/Story';
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

describe('Story service PATCH /api/v1/story/:storyId (process story)', () => {
  test('should return a 401 error response when user is not authenticated', async () => {
    const { status, body } = await agent.patch(`/api/v1/story/${storyId}`);
    expect(status).toEqual(401);
    expect(body.message).toEqual('Needs Authentication');
  });

  test('should return a 401 when user is authenticated but not an Admin', async () => {
    const { status, body } = await agent.patch(`/api/v1/story/${storyId}`).set('Authorization', `Bearer ${token}`);

    expect(status).toEqual(401);
    expect(body.message).toEqual('Un-authorized');
  });

  test('should return a 400 when user is admin but inputs fail validation', async () => {
    const { status, body } = await agent.patch(`/api/v1/story/${storyId}`).set('Authorization', `Bearer ${adminToken}`);

    expect(status).toEqual(400);
    expect(body.message).toEqual('Some field(s) are failing validation');
    expect(typeof body.errors).toEqual('object');
    expect(Array.isArray(body.errors.status)).toEqual(true);
  });

  test('should return a 404 when user story does not exist', async () => {
    const { status, body } = await agent
      .patch(`/api/v1/story/${fakeStoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: StoryStatus.APPROVED });

    expect(status).toEqual(404);
    expect(body.message).toEqual(`Story with id: ${fakeStoryId} not found`);
  });

  test('should return a 200 when user story exist', async () => {
    expect(_story.status).not.toEqual(StoryStatus.APPROVED);

    const { status, body } = await agent
      .patch(`/api/v1/story/${storyId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: StoryStatus.APPROVED });

    expect(status).toEqual(200);
    expect(body.story.status).toEqual(StoryStatus.APPROVED);
    expect(body.story.summary).toEqual(_story.summary);
    expect(body.story.type).toEqual(_story.type);
    expect(body.story.cost).toEqual(_story.cost);
    expect(body.story.complexity).toEqual(_story.complexity);
  });
});
