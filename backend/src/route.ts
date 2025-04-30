import express from "express";
import controller from "./controllers/image_controller";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure images folder exists
const imagesDir = path.join(process.cwd(), "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();
router.get("/getImageList", (req, res) =>
  controller.getImageList(req, res)
);
router.post("/uploadCustomImage", upload.single("file"), (req, res) =>
  controller.uploadImage(req, res)
);
router.post("/getRandomImage", (req, res) =>
  controller.getRandomImage(req, res)
);
router.post("/getSpecificImage", (req, res) =>
  controller.getSpecificImage(req, res));
router.get("/getImage", (req, res) => controller.serveImage(req, res));

export default router;
