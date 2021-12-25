import express from 'express';
import imagesRoute from './api/imageRoute/imageRoute';

const routes = express.Router();

routes.use('/image', imagesRoute);

export default routes;
