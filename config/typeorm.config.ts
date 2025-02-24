import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const typeOrmConfig = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  ssl: {
    rejectUnauthorized: true,
  },
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
});

module.exports = typeOrmConfig;
