import { createConnection, Connection } from 'typeorm';
import { Story } from './entities/Story';
import { User } from './entities/User';
import { BaseEntity } from './entities/BaseEntity';
import config from './config';

async function bootstrapDB(): Promise<Connection> {
  return createConnection({
    type: 'postgres',
    synchronize: false,
    host: config.HOST,
    port: config.PORT,
    username: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE,
    entities: [BaseEntity, User, Story],
  });
}

export default bootstrapDB();
