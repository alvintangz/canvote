const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const politicalPartySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    colour: {
      type: String,
      required: true,
      unique: true
    }
  }
);

let PoliticalParties = mongoose.model("PoliticalParty", politicalPartySchema);
module.exports = { PoliticalParties, politicalPartySchema };
