"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageRoute_1 = __importDefault(require("./api/imageRoute/imageRoute"));
const routes = express_1.default.Router();
routes.get('/', (req, res) => {
    res.send('hello');
});
routes.use('/image', imageRoute_1.default);
exports.default = routes;
