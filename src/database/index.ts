import { createConnection } from 'typeorm';
import User from './entities/User';
import Story from './entities/Story';
import config from './config';

(async function bootstrapDB(): Promise<void> {
  await createConnection({
    type: 'postgres',
    synchronize: false,
    host: config.HOST,
    port: config.PORT,
    username: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE,
    entities: [User, Story],
  });
})();
