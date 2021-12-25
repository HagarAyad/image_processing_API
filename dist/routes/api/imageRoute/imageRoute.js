"use strict";
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
const imageRoute_service_1 = __importDefault(require("./imageRoute.service"));
const validator_1 = require("./validator");
const imagesRoute = express_1.default.Router();
imagesRoute.get('/', validator_1.fileNameValidator, validator_1.heightValidator, validator_1.widthValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(validator_1.validationErrorFormatter);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        const { height, width, fileName } = req.query;
        const imageResizeSrv = new imageRoute_service_1.default();
        const isAllowedFileName = yield imageResizeSrv.checkAllowedFileName(fileName);
        if (!isAllowedFileName) {
            const allowedNames = imageResizeSrv.getAllowedFilesName();
            res.statusCode = 404;
            res.send(`image name must be one value from : ${allowedNames} `);
        }
        else {
            const resizedImgPath = yield imageResizeSrv.getResizedImagePath(fileName, height, width);
            res.sendFile(resizedImgPath);
        }
    }
    catch (error) {
        res.status(500).send('server error');
    }
}));
exports.default = imagesRoute;
