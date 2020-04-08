import mongoose from 'mongoose';

const politicalPartySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: [1, 'Please provide a name with at least one character.'],
    },
    colour: {
      type: String,
      unique: true,
      required: true,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid HEX colour code.'],
    },
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
      required: true,
    },
  },
);

export default mongoose.model('PoliticalParty', politicalPartySchema);
