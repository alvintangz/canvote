import env from 'dotenv';

env.config();

const IN_PRODUCTION = parseInt(process.env.PRODUCTION, 10) === 1;
const PORT = process.env.PORT || 3002;
const { JWT_SECRET_KEY } = process.env;
const DB_CONNECTION_STRING = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
const DB_USERNAME = process.env.MONGO_USERNAME;
const DB_PASSWORD = process.env.MONGO_PASSWORD;

export {
  IN_PRODUCTION,
  PORT,
  JWT_SECRET_KEY,
  DB_CONNECTION_STRING,
  DB_USERNAME,
  DB_PASSWORD,
};
