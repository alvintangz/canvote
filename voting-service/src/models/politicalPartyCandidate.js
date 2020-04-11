import mongoose from 'mongoose';

const politicalPartyCandidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    political_party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PoliticalParty',
      required: true,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: true,
    },
    picture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
      required: true,
    },
  },
);

politicalPartyCandidateSchema.index({
  district: 1,
  political_party: 1,
}, {
  unique: true,
});

export default mongoose.model('PoliticalPartyCandidate', politicalPartyCandidateSchema);
