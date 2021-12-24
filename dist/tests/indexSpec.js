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
const supertest_1 = __importDefault(require("supertest"));
const fs = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("../index"));
const request = (0, supertest_1.default)(index_1.default);
describe('Test imageResize api : ', () => {
    it('should have file name', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/image?width=200&height=200`);
        expect(response.status).toBe(400);
        expect(response.text).toContain('fileName is required');
        done();
    }));
    it('should have valid file name', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/image?fileName=hagar&height=100&width=200`);
        expect(response.status).toBe(404);
        expect(response.text).toContain('image name must be one value from');
        done();
    }));
    it('should have height', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/image?fileName=hagar`);
        expect(response.status).toBe(400);
        expect(response.text).toContain('Height is required');
        done();
    }));
    it('height should be number', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/image?fileName=hagar&height=hagar`);
        expect(response.status).toBe(400);
        expect(response.text).toContain('Height must be number');
        done();
    }));
    it('should have width', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/image?fileName=hagar&height=200`);
        expect(response.status).toBe(400);
        expect(response.text).toContain('Width is required');
        done();
    }));
    it('width should be number', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/image?fileName=hagar&height=123&width=hagar`);
        expect(response.status).toBe(400);
        expect(response.text).toContain('Width must be number');
        done();
    }));
    it('check resized image created', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/image?fileName=fjord&height=300&width=300`);
        const files = fs.readdirSync(path_1.default.resolve('assets', 'resizedImgs'));
        if (files.includes('fjord_300_300.jpg')) {
            expect(response.status).toBe(200);
        }
        done();
    }));
});
