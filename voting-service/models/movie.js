const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    producer: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

let Movies = mongoose.model("Movie", movieSchema);
module.exports = { Movies, movieSchema };
