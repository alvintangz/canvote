const mongoose = require('mongoose');

const { Schema } = mongoose;

const politicalPartyCandidateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    political_party: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
  },
);
politicalPartyCandidateSchema.index({ district: 1, name: 1, political_party: 1 }, { unique: true });
politicalPartyCandidateSchema.index({ district: 1, political_party: 1 }, { unique: true });


const PoliticalPartyCandidates = mongoose.model('PoliticalPartyCandidate', politicalPartyCandidateSchema);
module.exports = { PoliticalPartyCandidates, politicalPartyCandidateSchema };
