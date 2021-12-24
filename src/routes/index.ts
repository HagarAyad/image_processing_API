import express from 'express';
import imagesRoute from './api/imageRoute/imageRoute';

const routes = express.Router();

routes.get('/', (req, res) => {
  res.send('hello');
});

routes.use('/image', imagesRoute);

export default routes;
