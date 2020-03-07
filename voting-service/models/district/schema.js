const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const districtSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    }
  }
);

let Districts = mongoose.model("District", districtSchema);
module.exports = { Districts, districtSchema };
