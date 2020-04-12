const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the district'],
      unique: true,
    },
  },
);

module.exports = mongoose.model('District',  districtSchema);
