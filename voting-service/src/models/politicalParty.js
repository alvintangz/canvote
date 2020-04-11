import mongoose from 'mongoose';

export default mongoose.model('PoliticalParty', new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name.'],
      unique: true,
      minlength: [1, 'Please provide a name with at least one character'],
    },
    colour: {
      type: String,
      unique: true,
      required: true,
      match: [/^#([A-Fa-f0-9]{6})$/, 'Please provide a valid HEX colour code with 6 characters'],
      uppercase: true
    },
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
      required: true,
    },
  },
));
