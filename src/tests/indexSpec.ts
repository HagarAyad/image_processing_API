import supertest from 'supertest';
import imgResizeService from '../routes/api/imageRoute/imageRoute.service';
import * as fs from 'fs-extra';
import path from 'path';
import app from '../index';

const request = supertest(app);

describe('Test imageResize API : ', () => {
  it('should have file name', async (done) => {
    const response = await request.get(`/image?width=200&height=200`);
    expect(response.status).toBe(400);
    expect(response.text).toContain('fileName is required');
    done();
  });

  it('should have valid file name', async (done) => {
    const response = await request.get(
      `/image?fileName=hagar&height=100&width=200`,
    );
    expect(response.status).toBe(404);
    expect(response.text).toContain('image name must be one value from');
    done();
  });

  it('should have height', async (done) => {
    const response = await request.get(`/image?fileName=hagar`);
    expect(response.status).toBe(400);
    expect(response.text).toContain('Height is required');
    done();
  });

  it('height should be number', async (done) => {
    const response = await request.get(`/image?fileName=hagar&height=hagar`);
    expect(response.status).toBe(400);
    expect(response.text).toContain('Height must be number');
    done();
  });

  it('should have width', async (done) => {
    const response = await request.get(`/image?fileName=hagar&height=200`);
    expect(response.status).toBe(400);
    expect(response.text).toContain('Width is required');
    done();
  });

  it('width should be number', async (done) => {
    const response = await request.get(
      `/image?fileName=hagar&height=123&width=hagar`,
    );
    expect(response.status).toBe(400);
    expect(response.text).toContain('Width must be number');
    done();
  });

  it('check resized image created', async (done) => {
    const response = await request.get(
      `/image?fileName=fjord&height=300&width=300`,
    );
    const files = fs.readdirSync(path.resolve('assets', 'resizedImgs'));
    if (files.includes('fjord_300_300.jpg')) {
      expect(response.status).toBe(200);
    }
    done();
  });
});

describe('Test imageResize Service : ', () => {
  it('check allowed file name', async (done) => {
    const imgResizeSrv = new imgResizeService();
    const shouldImgExist = await imgResizeSrv.checkAllowedFileName('fjord');
    const shouldntImgExist = await imgResizeSrv.checkAllowedFileName('x');
    expect(shouldImgExist).toBeTrue();
    expect(shouldntImgExist).toBeFalse();
    done();
  });
  it('retrieve allowed files name', (done) => {
    const imgResizeSrv = new imgResizeService();
    const allowedNames = imgResizeSrv.getAllowedFilesName();
    expect(allowedNames).toContain('fjord');
    expect(allowedNames).toContain('icelandwaterfall');
    expect(allowedNames).toContain('encenadaport');
    expect(allowedNames).toContain('palmtunnel');
    expect(allowedNames).toContain('santamonica');
    done();
  });
  it('retrieve Resized image', async (done) => {
    const imgResizeSrv = new imgResizeService();
    await imgResizeSrv.getResizedImagePath('fjord', '50', '50');
    const files = fs.readdirSync(path.resolve('assets', 'resizedImgs'));
    expect(files.includes('fjord_50_50.jpg')).toBeTrue();
    done();
  });
});
