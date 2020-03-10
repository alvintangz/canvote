const mongoose = require('mongoose');

mongoose
  .connect(`mongoose://${process.env.MONGO_USERNANE}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
  .catch((e) => {
    console.error('Connection error', e.message);
  });

const db = mongoose.connection;

module.exports = db;
