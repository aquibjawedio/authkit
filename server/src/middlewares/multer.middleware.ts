import multer from "multer";
import path from "path";

import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "public", "temp");
    fs.mkdirSync(uploadPath, { recursive: true });
    return cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = file.originalname + "-" + Date.now();
    return cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export { upload };
