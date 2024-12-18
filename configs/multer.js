import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const baseDir = "uploads/chats_images";
    const { user_id, subject } = req.body;
    const fullPath = path.join(baseDir, user_id, subject);

    fs.mkdirSync(fullPath, { recursive: true });

    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export { upload };