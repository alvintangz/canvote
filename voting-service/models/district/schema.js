const mongoose = require('mongoose');

const { Schema } = mongoose;

const districtSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
);

const Districts = mongoose.model('District', districtSchema);
module.exports = { Districts, districtSchema };
