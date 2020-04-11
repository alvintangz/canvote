import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
// TODO
import { rejectErrorIfNeeded } from '../schemas/resolvers/helpers';

const Media = mongoose.model('Media', new mongoose.Schema(
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
));

const uploadToFolder = path.join(__dirname, '../../media');
export const MediaUtility = {
  upload(file) {
    return new Promise((resolve, reject) => {
      const { createReadStream, filename, mimetype } = file;
      const fsFilename = uuidv4();
      const uploadTo = path.join(uploadToFolder, fsFilename);
      const upload = () => {
        const writeStream = createReadStream()
          .pipe(fs.createWriteStream(uploadTo));

        writeStream.on('finish', () => {
          const toCreate = new Media();
          toCreate.fsFilename = fsFilename;
          toCreate.filename = filename;
          toCreate.mimetype = mimetype;
          toCreate.save((err, res) => {
            // TODO
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
      };

      fs.access(uploadToFolder, fs.constants.F_OK, (err) => {
        !err ? upload() : fs.mkdir(uploadToFolder, { recursive: true }, (err) => {
          if (err) reject(err);
          upload();
        });
      });
    });
  },
  delete(mediaId) {
    Media.findByIdAndRemove(mediaId, (err, res) => {
      if (res) {
        const unlinkFrom = path.join(uploadToFolder, res.fsFilename);
        fs.unlink(unlinkFrom, () => {});
      }
      return res;
    });
  },
  getPath(media) {
    return path.join(uploadToFolder, media.fsFilename);
  }
};

export default Media;
