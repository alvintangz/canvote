import mongoose from 'mongoose';

/**
 * Voter collection ensures a voter is binded with a district.
 *
 * This record is held independently from the authentication service's voter records. It is not
 * to be used to validate if a voter exists or if a voter is active.
 */
export default mongoose.model('Voter', new mongoose.Schema(
  {
    authId: {
      type: String,
      required: [true, 'Please provide the auth id for the voter'],
      unique: true,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: [true, 'Please provide the district for the voter']
    },
  },
));
