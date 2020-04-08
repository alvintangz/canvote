import mongoose from 'mongoose';

const ballotCountSchema = new mongoose.Schema(
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
);

export default mongoose.model('BallotCount', ballotCountSchema);
