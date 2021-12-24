import supertest from 'supertest';
import * as fs from 'fs-extra';
import path from 'path';
import app from '../index';

const request = supertest(app);

describe('Test imageResize api : ', () => {
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
