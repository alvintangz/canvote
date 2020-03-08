const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteSchema = new Schema(
  {
    voter: {
      type: String,
      required: true,
      unique: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  } 
);


let Votes = mongoose.model("Vote", voteSchema);
module.exports = { Votes, voteSchema };
