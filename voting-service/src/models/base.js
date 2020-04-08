import { Schema as MongooseSchema } from 'mongoose';

export default function Schema() {
  const schema = new MongooseSchema();

  schema.post('save', (err, doc, next) => {
    if (err.name === 'MongoError') {
      switch (err.code) {
        case 110000:
          next(new Error('Duplicate key'));
          break;
        default:
          next(new Error('fuck'));
      }
    } else {
      next();
    }
  });

  return schema;
}
