import 'dotenv/config';
import 'reflect-metadata';
import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import './database';
import identityRouter from './identity/identity.routes';
import storyRouter from './story/story.routes';

const app = express();

// Body parser and helmet middleware
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, resp) =>
  resp.json({
    message: 'Welcome to PYG server',
  }),
);

app.use('/auth', identityRouter);
app.use('/story', storyRouter);

// Error Handler
app.use((error: Error, req: Request, resp: Response) => {
  return resp.status(500).json({
    message: 'Internal Server error',
  });
});

export default app;
