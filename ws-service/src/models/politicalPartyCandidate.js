const mongoose = require('mongoose');

const politicalPartyCandidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the candidate'],
    },
    political_party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PoliticalParty',
      required: [true, 'Please provide a political party for the candidate'],
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: [true, 'Please provide a district for the candidate'],
    },
  },
);

politicalPartyCandidateSchema.index({
  district: 1,
  political_party: 1,
}, {
  unique: true,
});

module.exports = mongoose.model('PoliticalPartyCandidate', politicalPartyCandidateSchema);
