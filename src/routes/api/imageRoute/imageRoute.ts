import express, { Request } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import * as fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import {
  fileNameValidator,
  widthValidator,
  heightValidator,
} from './validator';

const imagesRoute = express.Router();

const assetsFolderName = 'assets';
const imagesFolderName = 'images';
const resizedImgFolderName = 'resizedImgs';

const imagesFolder = path.resolve(assetsFolderName, imagesFolderName);
const resizedImgFolder = path.resolve(assetsFolderName, resizedImgFolderName);

const errorFormatter = ({ msg, param }: ValidationError) => {
  return `${param}: ${msg}`;
};

function isImgExist(files: string[], resizedImgName: string) {
  let isExist = false;
  files.map((item) => {
    const fileNameParts = item.split('.');
    fileNameParts.pop();
    const fileName = fileNameParts.join('.');
    if (fileName === resizedImgName) isExist = true;
  });
  return isExist;
}

function getResizedImgPath(resizedImgName: string) {
  return path.resolve(
    assetsFolderName,
    resizedImgFolderName,
    `${resizedImgName}.jpg`,
  );
}

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
  async (req: resizeHandlerRequest, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const { height, width, fileName } = req.query;
      await fs.ensureDir(imagesFolder);
      const files = fs.readdirSync(imagesFolder);

      const isImageExist = isImgExist(files, fileName);
      if (!isImageExist) {
        const allowedNames = files
          .map((item) => {
            const fileNameParts = item.split('.');
            fileNameParts.pop();
            const fileName = fileNameParts.join('.');
            return fileName;
          })
          .join(` , `);

        res.statusCode = 404;
        res.statusMessage = 'not found';
        res.send(`image name must be one value from : ${allowedNames} `);
      } else {
        await fs.ensureDir(resizedImgFolder);
        const resizedImgs = fs.readdirSync(resizedImgFolder);
        const resizedImgName = `${fileName}_${width}_${height}`;

        if (isImgExist(resizedImgs, resizedImgName)) {
          res.sendFile(getResizedImgPath(resizedImgName));
        } else {
          sharp(`${imagesFolder}/${fileName}.jpg`)
            .resize(parseInt(width), parseInt(height))
            .toFile(`${resizedImgFolder}/${resizedImgName}.jpg`, (err) => {
              if (err) {
                res.status(500).send('resize error');
              } else {
                res.sendFile(getResizedImgPath(resizedImgName));
              }
            });
        }
      }
    } catch (error) {
      res.status(500).send('server error');
    }
  },
);

export default imagesRoute;
