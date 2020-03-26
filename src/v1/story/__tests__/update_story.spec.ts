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
let storyId: string;
const fakeStoryId = '3e082997-7c05-485b-afd3-bf56fbde6a48';
let _story: Story;

beforeAll(done => {
  app.on('SETUP', async () => {
    const user = await getRepository(User).findOne({ where: { email: users[1].email } });
    const [story] = await getRepository(Story).find();
    _story = story;
    storyId = story.id;
    token = generateToken({ id: user.id, role: users[1].role });
    done();
  });
});

describe('Story service PUT /api/v1/story/:storyId (update story)', () => {
  test('should return a 401 error response when user is not authenticated', async () => {
    const { status, body } = await agent.put(`/api/v1/story/${storyId}`);
    expect(status).toEqual(401);
    expect(body.message).toEqual('Needs Authentication');
  });

  test('should return a 400 when inputs fail validation', async () => {
    const { status, body } = await agent
      .put(`/api/v1/story/${storyId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        summary: 234,
      });

    expect(status).toEqual(400);
    expect(body.message).toEqual('Some field(s) are failing validation');
    expect(typeof body.errors).toEqual('object');
    expect(Array.isArray(body.errors.summary)).toEqual(true);
  });

  test('should return a 404 when user story does not exist orn user not admin or story owner', async () => {
    const { status, body } = await agent.put(`/api/v1/story/${fakeStoryId}`).set('Authorization', `Bearer ${token}`);

    expect(status).toEqual(404);
    expect(body.message).toEqual(`Story with id: ${fakeStoryId} not found`);
  });

  test('should return a 200 when user story exist', async () => {
    const newSummary = 'Updated story summary';

    expect(_story.summary).not.toEqual(newSummary);

    const { status, body } = await agent
      .put(`/api/v1/story/${storyId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        summary: newSummary,
      });

    expect(status).toEqual(200);
    expect(body.story.summary).toEqual(newSummary);
    expect(body.story.type).toEqual(_story.type);
    expect(body.story.cost).toEqual(_story.cost);
    expect(body.story.complexity).toEqual(_story.complexity);
  });
});
