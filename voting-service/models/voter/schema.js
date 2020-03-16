const mongoose = require('mongoose');

const { Schema } = mongoose;

const voterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
);


const Voters = mongoose.model('Voter', voterSchema);
module.exports = { Voters, voterSchema };
