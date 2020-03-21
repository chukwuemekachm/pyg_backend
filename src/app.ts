import 'dotenv/config';
import 'reflect-metadata';
import './database';
import express, { Response, Request, NextFunction } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import v1Router from './v1';

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

app.use('/api/v1/', v1Router);

app.all('*', (req: Request, resp: Response) => {
  return resp.status(404).json({
    message: 'Route un-available',
  });
});

// Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error, req: Request, resp: Response, next: NextFunction) => {
  return resp.status(500).json({
    message: 'Internal Server error',
  });
});

export default app;
