const mongoose = require('mongoose');

const ballotCountSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PoliticalPartyCandidate',
      required: [true, 'Please provide a candidate for the ballot count'],
      unique: false,
    },
  },
);

module.exports = mongoose.model('BallotCount', ballotCountSchema);
