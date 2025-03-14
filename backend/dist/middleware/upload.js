"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTour = exports.uploadProfile = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ensureDirectory = (dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
};
// Profile Picture Storage
const profileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const dir = path_1.default.join(process.cwd(), "uploads");
        ensureDirectory(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
// Tour Image Storage
const tourStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const dir = path_1.default.join(process.cwd(), "tour_pics");
        ensureDirectory(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
exports.uploadProfile = (0, multer_1.default)({
    storage: profileStorage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|svg|gif/;
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        }
        else {
            cb(new Error("Only images (jpeg, jpg, png, gif, svg, webp) are allowed"));
        }
    },
});
exports.uploadTour = (0, multer_1.default)({ storage: tourStorage });
