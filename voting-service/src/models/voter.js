import mongoose from 'mongoose';

const voterSchema = new mongoose.Schema(
  {
    authId: {
      type: String,
      required: true,
      unique: true,
    },
    district: {
      type: String,
      required: true,
    },
    // TODO: Disable?
  },
);

export default mongoose.model('Voter', voterSchema);
