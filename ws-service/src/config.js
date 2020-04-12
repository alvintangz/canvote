
require('dotenv').config();

const PORT = process.env.PORT || 3003;
const DB_HOST = process.env.MONGO_HOST || 'localhost';
const DB_PORT = process.env.MONGO_PORT || '27017';
const DB_DATABASE = process.env.MONGO_DATABASE || 'canvote';
const DB_CONNECTION_STRING = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
const DB_USERNAME = process.env.MONGO_USERNAME;
const DB_PASSWORD = process.env.MONGO_PASSWORD;

module.exports = {
  PORT,
  DB_CONNECTION_STRING,
  DB_USERNAME,
  DB_PASSWORD,
};
