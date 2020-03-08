const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    }
  } 
);


let Voters = mongoose.model("Voter", voterSchema);
module.exports = { Voters, voterSchema };
