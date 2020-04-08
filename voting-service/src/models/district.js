// eslint-disable-next-line no-unused-vars
import GeoJson from 'mongoose-geojson-schema';
import mongoose from 'mongoose';

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    geoJson: mongoose.Schema.Types.MultiPolygon,
  },
);

export default mongoose.model('District', districtSchema);
