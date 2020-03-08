const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ballotSchema = new Schema(
  {
    candidate: {
      type: String,
      required: true,
      unique: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  } 
);


let Ballots = mongoose.model("Ballot", ballotSchema);
module.exports = { Ballots, ballotSchema };
