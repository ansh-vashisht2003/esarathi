import multer from "multer";
import path from "path";
import fs from "fs";

const folder = "traveller_pic";

// create folder if not exists
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export default upload;
