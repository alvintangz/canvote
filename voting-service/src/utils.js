import path from "path";
import fs from "fs";
import { Media } from './models';

export const cleanAndRemoveMediaById = (id) => {
  Media.findByIdAndRemove(id, (err, res) => {
    if (res) {
      const unlinkFrom = path.join(__dirname, '../../media', res.fsFilename);
      fs.unlink(unlinkFrom, () => {});
    }
    return res;
  });
};
