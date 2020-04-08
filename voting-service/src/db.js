/* eslint-disable no-debugger, no-console */
import mongoose from 'mongoose';
import { DB_CONNECTION_STRING, DB_PASSWORD, DB_USERNAME } from './config';

export default () => {
  mongoose.connect(DB_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    user: DB_USERNAME,
    pass: DB_PASSWORD,
  }).then(() => console.log('Connected to MongoDB database - ', process.env.MONGO_DATABASE))
    .catch((err) => console.error('MongoDB connection error - ', err));
};
