import * as fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';

const assetsFolderName = 'assets';
const imagesFolderName = 'images';
const resizedImgFolderName = 'resizedImgs';

const imagesFolder = path.resolve(assetsFolderName, imagesFolderName);
const resizedImgFolder = path.resolve(assetsFolderName, resizedImgFolderName);

function getResizedImgPath(resizedImgName: string): string {
  return path.resolve(
    assetsFolderName,
    resizedImgFolderName,
    `${resizedImgName}.jpg`,
  );
}

function isImgExist(files: string[], resizedImgName: string): boolean {
  let isExist = false;
  files.map((item) => {
    const fileNameParts = item.split('.');
    fileNameParts.pop();
    const fileName = fileNameParts.join('.');
    if (fileName === resizedImgName) isExist = true;
  });
  return isExist;
}

export default class imageResizeService {
  fileName?: string;
  height?: number;
  width?: number;

  constructor(fileName?: string, height?: number, width?: number) {
    this.fileName = fileName;
    this.height = height;
    this.width = width;
  }

  async checkAllowedFileName(fileName: string): Promise<boolean> {
    await fs.ensureDir(imagesFolder);
    const files = fs.readdirSync(imagesFolder);
    return isImgExist(files, fileName);
  }

  getAllowedFilesName(): string {
    const files = fs.readdirSync(imagesFolder);
    const allowedNames = files
      .map((item) => {
        const fileNameParts = item.split('.');
        fileNameParts.pop();
        const fileName = fileNameParts.join('.');
        return fileName;
      })
      .join(` , `);
    return allowedNames;
  }

  async getResizedImagePath(
    fileName: string,
    height: string,
    width: string,
  ): Promise<string> {
    await fs.ensureDir(resizedImgFolder);
    const resizedImgs = fs.readdirSync(resizedImgFolder);
    const resizedImgName = `${fileName}_${width}_${height}`;
    if (isImgExist(resizedImgs, resizedImgName)) {
      return getResizedImgPath(resizedImgName);
    } else {
      await sharp(`${imagesFolder}/${fileName}.jpg`)
        .resize(parseInt(width), parseInt(height))
        .toFile(`${resizedImgFolder}/${resizedImgName}.jpg`);
      return getResizedImgPath(resizedImgName);
    }
  }
}
