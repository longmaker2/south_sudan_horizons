import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure directories exist
const ensureDirectory = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 📌 Profile Picture Storage
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../uploads/"); // Ensuring correct path
    ensureDirectory(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// 📌 Tour Image Storage
const tourStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../tour_pics/"); // Ensuring correct path
    ensureDirectory(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploadProfile = multer({ storage: profileStorage });
export const uploadTour = multer({ storage: tourStorage });
