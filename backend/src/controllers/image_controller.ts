import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesFolder = path.join(process.cwd(), 'images');

class ImageController {
  public async getImageList(req: Request, res: Response): Promise<void> {
    try {
      if (!fs.existsSync(imagesFolder)) {
        res.status(404).json({ message: 'Images folder does not exist.' });
        return;
      }

      const files = fs.readdirSync(imagesFolder);
      if (files.length === 0) {
        res.status(404).json({ message: 'No images found in the folder.' });
        return;
      }

      const imageList = files
        .filter((file) => !file.startsWith('resized_'))
        .map((file) => ({
          filename: file,
          url: `${req.protocol}://${req.get('host')}/api/getImage/?filename=${file}&width=200&height=200`,
        }));
      res.status(200).json(imageList);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving image list.', error });
    }
  }
  public async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      const { width, height } = req.query;

      if (!file) {
        res.status(400).json({ message: 'No file uploaded.' });
        return;
      }
      if (!width || !height) {
        res.status(400).json({ message: 'Width and height are required.' });
        return;
      }

      const imageUrl = `${req.protocol}://${req.get(
        'host'
      )}/api/getImage/?filename=${
        file.originalname
      }&width=${width}&height=${height}`;

      res
        .status(201)
        .json({ message: 'Image uploaded successfully.', imageUrl });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading image.', error });
    }
  }

  public async getRandomImage(req: Request, res: Response): Promise<void> {
    try {
      if (!fs.existsSync(imagesFolder)) {
        res.status(404).json({ message: 'Images folder does not exist.' });
        return;
      }

      const files = fs.readdirSync(imagesFolder);
      if (files.length === 0) {
        res.status(404).json({ message: 'No images found in the folder.' });
        return;
      }
      const unResizedImages = files.filter(
        (file) => !file.startsWith('resized_')
      );
      const randomImage =
        unResizedImages[Math.floor(Math.random() * unResizedImages.length)];
      const { width, height } = req.query;

      if (!width || !height) {
        res
          .status(400)
          .json({ message: 'Width and height query parameters are required.' });
        return;
      }

      const imageUrl = `${req.protocol}://${req.get(
        'host'
      )}/api/getImage/?width=${width}&height=${height}&filename=${randomImage}`;

      res.status(200).json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving image.', error });
    }
  }
  public async getSpecificImage(req: Request, res: Response): Promise<void> {
    try {
      const { filename, width, height } = req.query;

      if (!filename || !width || !height) {
        res.status(400).json({
          message: 'Filename, width, and height query parameters are required.',
        });
        return;
      }

      const imagePath = path.join(imagesFolder, '/', filename as string);

      if (!fs.existsSync(imagePath)) {
        res.status(404).json({ message: 'Image not found.' });
        return;
      }
      const imageUrl = `${req.protocol}://${req.get(
        'host'
      )}/api/getImage/?width=${width}&height=${height}&filename=${filename}`;

      res.status(200).json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving image.', error });
    }
  }
  async transformImage(
    image: string,
    width: number,
    height: number
  ): Promise<string> {
    const imagePath = path.join(imagesFolder, image);
    const resizedImagePath = path.join(
      imagesFolder,
      `resized_${width}x${height}_${image}`
    );
    if (!fs.existsSync(resizedImagePath)) {
      await sharp(imagePath).resize(width, height).toFile(resizedImagePath);
    }

    return resizedImagePath;
  }

  public async serveImage(req: Request, res: Response): Promise<void> {
    try {
      const { filename, width, height } = req.query;

      if (!filename || !width || !height) {
        res
          .status(400)
          .json({ message: 'Filename, width, and height are required.' });
        return;
      }

      const widthNum = parseInt(width as string);
      const heightNum = parseInt(height as string);

      if (isNaN(widthNum) || isNaN(heightNum)) {
        res
          .status(400)
          .json({ message: 'Width and height must be valid numbers.' });
        return;
      }

      const imagePath = path.join(imagesFolder, filename as string);

      if (!fs.existsSync(imagePath)) {
        res.status(404).json({ message: 'Image not found.' });
        return;
      }

      const resizedImagePath = await this.transformImage(
        filename as string,
        widthNum,
        heightNum
      );
      if (!fs.existsSync(resizedImagePath)) {
        res.status(404).json({ message: 'Resized image not found.' });
        return;
      }
      // Serve the resized image
      res.sendFile(resizedImagePath);
    } catch (error) {
      res.status(500).json({ message: 'Error serving image.', error });
    }
  }
}

export default new ImageController();
