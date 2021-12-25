"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const assetsFolderName = 'assets';
const imagesFolderName = 'images';
const resizedImgFolderName = 'resizedImgs';
const imagesFolder = path_1.default.resolve(assetsFolderName, imagesFolderName);
const resizedImgFolder = path_1.default.resolve(assetsFolderName, resizedImgFolderName);
function getResizedImgPath(resizedImgName) {
    return path_1.default.resolve(assetsFolderName, resizedImgFolderName, `${resizedImgName}.jpg`);
}
function isImgExist(files, resizedImgName) {
    let isExist = false;
    files.map((item) => {
        const fileNameParts = item.split('.');
        fileNameParts.pop();
        const fileName = fileNameParts.join('.');
        if (fileName === resizedImgName)
            isExist = true;
    });
    return isExist;
}
class imageResizeService {
    constructor(fileName, height, width) {
        this.fileName = fileName;
        this.height = height;
        this.width = width;
    }
    checkAllowedFileName(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs.ensureDir(imagesFolder);
            const files = fs.readdirSync(imagesFolder);
            return isImgExist(files, fileName);
        });
    }
    getAllowedFilesName() {
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
    getResizedImagePath(fileName, height, width) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs.ensureDir(resizedImgFolder);
            const resizedImgs = fs.readdirSync(resizedImgFolder);
            const resizedImgName = `${fileName}_${width}_${height}`;
            if (isImgExist(resizedImgs, resizedImgName)) {
                return getResizedImgPath(resizedImgName);
            }
            else {
                yield (0, sharp_1.default)(`${imagesFolder}/${fileName}.jpg`)
                    .resize(parseInt(width), parseInt(height))
                    .toFile(`${resizedImgFolder}/${resizedImgName}.jpg`);
                return getResizedImgPath(resizedImgName);
            }
        });
    }
}
exports.default = imageResizeService;
