// eslint-disable-next-line no-unused-vars
import GeoJson from 'mongoose-geojson-schema';
import mongoose from 'mongoose';

export default mongoose.model('District', new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the district'],
      unique: true,
    },
    geoJson: mongoose.Schema.Types.MultiPolygon,
    required: [true, 'Please provide a MultiPolygon GeoJson object for the district']
  },
));
