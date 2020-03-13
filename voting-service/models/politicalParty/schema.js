const mongoose = require('mongoose');

const { Schema } = mongoose;

const politicalPartySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    colour: {
      type: String,
      required: true,
      unique: true,
    },
  },
);

const PoliticalParties = mongoose.model('PoliticalParty', politicalPartySchema);
module.exports = { PoliticalParties, politicalPartySchema };
