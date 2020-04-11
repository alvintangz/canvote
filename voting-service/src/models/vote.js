import mongoose from 'mongoose';

/**
 * Collection to ensure a voter has voted once.
 */
export default mongoose.model('Vote', new mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
));
