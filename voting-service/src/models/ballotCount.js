import mongoose from 'mongoose';

const ballotCountSchema = new mongoose.Schema(
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
);

// Prevent deletion of ballot counts - no matter what
ballotCountSchema.pre('remove', () => {
  throw new Error("Cannot remove a ballot.");
});

export default mongoose.model('BallotCount', ballotCountSchema);
