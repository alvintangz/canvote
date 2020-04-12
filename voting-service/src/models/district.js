// eslint-disable-next-line no-unused-vars
import GeoJson from 'mongoose-geojson-schema';
import mongoose from 'mongoose';

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the district'],
      unique: true,
    },
    geoJson: {
      type: mongoose.Schema.Types.MultiPolygon,
      required: [true, 'Please provide a MultiPolygon GeoJson object for the district']
    },
  },
);

export default mongoose.model('District',  districtSchema);
