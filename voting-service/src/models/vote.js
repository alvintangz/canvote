import mongoose from 'mongoose';

/**
 * Collection to ensure a voter has voted once.
 */
const voteSchema = new mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide a voter for the vote'],
      unique: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
);

// Prevent deletion of vote - no matter what
voteSchema.pre('remove', () => {
  throw new Error("Cannot remove a vote.");
});

export default mongoose.model('Vote', voteSchema);
