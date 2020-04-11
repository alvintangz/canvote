import mongoose from 'mongoose';

export default mongoose.model('BallotCount', new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PoliticalPartyCandidate',
      required: [true, 'Please provide a candidate for the ballot count'],
      unique: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
));
