import express from 'express';
import Media, { MediaUtility } from './models/media';
import Mongoose from 'mongoose';

const router = express.Router();

router.get('/media/:id', (req, res) => {
  const notFoundMsg = `The media object with the id of "${req.params.id}" could not be found.`;
  if (!Mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).end(notFoundMsg);
  Media.findById(req.params.id, (err, media) => {
    if (err) return res.status(500).end(err.toString());
    if (!media) return res.status(404).end(notFoundMsg);
    return res.status(200).set('Content-Type', media.mimetype).sendFile(MediaUtility.getPath(media));
  });
});

export default router;
