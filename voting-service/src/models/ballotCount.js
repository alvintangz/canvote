import mongoose from 'mongoose';

export default mongoose.model('BallotCount', new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PoliticalPartyCandidate',
      required: true,
      unique: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
));
