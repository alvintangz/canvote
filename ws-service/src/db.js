const mongoose = require('mongoose');
const { DB_CONNECTION_STRING, DB_PASSWORD, DB_USERNAME } = require('./config');

module.exports = () => {
  mongoose.connect(DB_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    user: DB_USERNAME,
    pass: DB_PASSWORD,
  }).then(() => console.log('Connected to MongoDB database -', process.env.MONGO_DATABASE))
    .catch((err) => console.error('MongoDB connection error -', err));
};
