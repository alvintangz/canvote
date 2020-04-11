// eslint-disable-next-line no-unused-vars
import GeoJson from 'mongoose-geojson-schema';
import mongoose from 'mongoose';

export default mongoose.model('District', new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    geoJson: mongoose.Schema.Types.MultiPolygon,
  },
));
