const mongoose = require('mongoose');

mongoose
  .connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`, { 
    useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, user: `${process.env.MONGO_USERNAME}`, pass: `${process.env.MONGO_PASSWORD}`
  })
  .then(() => { console.log("Connected to db")})
  .catch((e) => {
    console.error('Connection error', e.message);
  });

const db = mongoose.connection;

module.exports = db;
