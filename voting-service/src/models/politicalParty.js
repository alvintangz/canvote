import mongoose from 'mongoose';

const politicalPartySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the party'],
      unique: true,
    },
    colour: {
      type: String,
      unique: true,
      required: [true, 'Please provide a HEX colour code with 6 characters for the party'],
      match: [/^#([A-Fa-f0-9]{6})$/, 'Please provide a valid HEX colour code with 6 characters'],
      uppercase: true
    },
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
      required: [true, 'Please provide a logo for the party'],
    },
  },
);

export default mongoose.model('PoliticalParty', politicalPartySchema);
