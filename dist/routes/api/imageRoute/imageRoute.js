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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const fs = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const validator_1 = require("./validator");
const imagesRoute = express_1.default.Router();
const assetsFolderName = 'assets';
const imagesFolderName = 'images';
const resizedImgFolderName = 'resizedImgs';
const imagesFolder = path_1.default.resolve(assetsFolderName, imagesFolderName);
const resizedImgFolder = path_1.default.resolve(assetsFolderName, resizedImgFolderName);
const errorFormatter = ({ msg, param }) => {
    return `${param}: ${msg}`;
};
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
function getResizedImgPath(resizedImgName) {
    return path_1.default.resolve(assetsFolderName, resizedImgFolderName, `${resizedImgName}.jpg`);
}
imagesRoute.get('/', validator_1.fileNameValidator, validator_1.heightValidator, validator_1.widthValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        const { height, width, fileName } = req.query;
        yield fs.ensureDir(imagesFolder);
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
        }
        else {
            yield fs.ensureDir(resizedImgFolder);
            const resizedImgs = fs.readdirSync(resizedImgFolder);
            const resizedImgName = `${fileName}_${width}_${height}`;
            if (isImgExist(resizedImgs, resizedImgName)) {
                res.sendFile(getResizedImgPath(resizedImgName));
            }
            else {
                (0, sharp_1.default)(`${imagesFolder}/${fileName}.jpg`)
                    .resize(parseInt(width), parseInt(height))
                    .toFile(`${resizedImgFolder}/${resizedImgName}.jpg`, (err) => {
                    if (err) {
                        res.status(500).send('resize error');
                    }
                    else {
                        res.sendFile(getResizedImgPath(resizedImgName));
                    }
                });
            }
        }
    }
    catch (error) {
        res.status(500).send('server error');
    }
}));
exports.default = imagesRoute;
