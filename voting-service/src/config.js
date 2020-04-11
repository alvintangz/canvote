import env from 'dotenv';

env.config();

const IN_PRODUCTION = process.env.PRODUCTION ? parseInt(process.env.PRODUCTION, 10) === 1 : 1;
const PORT = process.env.PORT || 3002;
const { JWT_SECRET_KEY } = process.env;
const DB_HOST = process.env.MONGO_HOST || 'localhost';
const DB_PORT = process.env.MONGO_PORT || '27017';
const DB_DATABASE = process.env.MONGO_DATABASE || 'canvote';
const DB_CONNECTION_STRING = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
const DB_USERNAME = process.env.MONGO_USERNAME || 'canvote';
const DB_PASSWORD = process.env.MONGO_PASSWORD;
const AUTH_SERVICE_BASE_URL = process.env.AUTH_SERVICE_BASE_URL || 'http://localhost:3001/api/v1';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

export {
  IN_PRODUCTION,
  PORT,
  JWT_SECRET_KEY,
  DB_CONNECTION_STRING,
  DB_PORT,
  DB_HOST,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  AUTH_SERVICE_BASE_URL,
  INTERNAL_API_KEY
};
