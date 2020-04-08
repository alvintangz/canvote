import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
// TODO
import { rejectErrorIfNeeded } from '../schemas/resolvers/helpers';

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    fsFilename: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
  },
);

mediaSchema.methods.upload = (file) => new Promise((resolve, reject) => {
  const { createReadStream, filename, mimetype } = file;
  const fsFilename = uuidv4();
  const uploadTo = path.join(__dirname, '../../media', fsFilename);

  const writeStream = createReadStream()
    .pipe(fs.createWriteStream(uploadTo));

  writeStream.on('finish', () => {
    this.model('Media').fsFilename = fsFilename;
    this.model('Media').filename = filename;
    this.model('Media').mimetype = mimetype;
    this.model('Media').save((err, res) => {
      if (rejectErrorIfNeeded(err, reject)) {
        fs.unlink(uploadTo, () => {});
      }
      resolve(res);
    });
  });

  writeStream.on('error', (error) => {
    fs.unlink(uploadTo, () => {
      reject(error);
    });
  });
});

mediaSchema.method.cleanAndRemoveById = (id) => {
  this.model('Media').findByIdAndRemove(id, (err, res) => {
    if (res) {
      const unlinkFrom = path.join(__dirname, '../../media', res.fsFilename);
      fs.unlink(unlinkFrom, () => {});
    }
    return res;
  });
};

export default mongoose.model('Media', mediaSchema);
