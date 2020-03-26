import 'dotenv/config';
import 'reflect-metadata';
import express, { Response, Request, NextFunction } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import bootstrapDB from './database';
import bootstrapV1Router from './v1';

const app = express();

bootstrapDB().then(() => {
  const v1Router = bootstrapV1Router();

  // Body parser, cors, and helmet middleware
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

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

  app.emit('SETUP');
});

export default app;
