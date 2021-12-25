import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import imageResizeService from './imageRoute.service';
import {
  fileNameValidator,
  widthValidator,
  heightValidator,
  validationErrorFormatter,
} from './validator';

const imagesRoute = express.Router();

type ReqQuery = {
  fileName: string;
  height: string;
  width: string;
};

type resizeHandlerRequest = Request<{}, {}, {}, ReqQuery>;

imagesRoute.get(
  '/',
  fileNameValidator,
  heightValidator,
  widthValidator,
  async (req: resizeHandlerRequest, res: Response) => {
    const errors = validationResult(req).formatWith(validationErrorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const { height, width, fileName } = req.query;
      const imageResizeSrv = new imageResizeService();
      const isAllowedFileName = await imageResizeSrv.checkAllowedFileName(
        fileName,
      );
      if (!isAllowedFileName) {
        const allowedNames = imageResizeSrv.getAllowedFilesName();
        res.statusCode = 404;
        res.send(`image name must be one value from : ${allowedNames} `);
      } else {
        const resizedImgPath = await imageResizeSrv.getResizedImagePath(
          fileName,
          height,
          width,
        );
        res.sendFile(resizedImgPath);
      }
    } catch (error) {
      res.status(500).send('server error');
    }
  },
);

export default imagesRoute;
