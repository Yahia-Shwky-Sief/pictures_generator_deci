import request from 'supertest';
import 'jasmine';
import { app } from '../src/server';
import transform from '../src/controllers/image_controller';
import fs from 'fs';
describe('API Endpoints', () => {
  it('should return 200 for the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should return 404 for an unknown endpoint', async () => {
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(404);
  });
});

describe('Image API Endpoints', () => {
  it('should return a list of images at /getImageList', async () => {
    const response = await request(app).get('/api/getImageList');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(jasmine.any(Array));
  });
  it('should upload an image successfully at /uploadCustomImage', async () => {
    const response = await request(app)
      .post('/api/uploadCustomImage?width=200&height=200')
      .attach('file', 'images/logo.jpg');
    expect(response.status).toBe(201);
  });

  it('should return a random image URL at /getRandomImage', async () => {
    const response = await request(app).post(
      '/api/getRandomImage?width=200&height=200'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      jasmine.objectContaining({ imageUrl: jasmine.any(String) })
    );
  });

  it('should return a specific image URL at /getSpecificImage', async () => {
    const response = await request(app).post(
      '/api/getSpecificImage?filename=santamonica.jpg&width=200&height=200'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      jasmine.objectContaining({ imageUrl: jasmine.any(String) })
    );
  });

  it('should serve an image at /getImage', async () => {
    const response = await request(app).get(
      '/api/getImage?width=200&height=200&filename=santamonica.jpg'
    );
    expect(response.status).toBe(200);
  });

  it('should return 404 for a non-existent image at /getImage', async () => {
    const response = await request(app).get(
      '/api/getImage?filename=nonexistent.jpg&width=200&height=200'
    );
    expect(response.status).toBe(404);
  });
});

describe('Image Processing', () => {
  it('should resize an image', async () => {
    const imagePath = 'logo.jpg';
    const width = 200;
    const height = 200;

    const outputPath = await transform.transformImage(imagePath, width, height);

    // Check if the resized image exists
    expect(fs.existsSync(outputPath)).toBe(true);
  });
});
