import express from 'express';
import { Media } from './models';

const router = express.Router();

router.get('/media/:id', (req, res) => {
  Media.findById(req.params.id, (err, item) => {
    if (err) return res.status(500).end(err.toString());
    if (!item) return res.status(404).end(`The media object with the id of "${req.params.id}" could not be found.`);
    return res.status(200).set('Content-Type', item.mimetype).sendFile(item.path);
  });
});

export default router;
