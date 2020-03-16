const mongoose = require('mongoose');

const { Schema } = mongoose;

const voteSchema = new Schema(
  {
    voter: {
      type: String,
      required: true,
      unique: true,
    },
    candidate: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },

  },
);


const Votes = mongoose.model('Vote', voteSchema);
module.exports = { Votes, voteSchema };
