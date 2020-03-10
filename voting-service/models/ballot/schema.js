const mongoose = require('mongoose');

const { Schema } = mongoose;

const ballotSchema = new Schema(
  {
    candidate: {
      type: String,
      required: true,
      unique: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
);


const Ballots = mongoose.model('Ballot', ballotSchema);
module.exports = { Ballots, ballotSchema };
