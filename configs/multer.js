import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const baseDir = "public/uploads/chats_images";
    const user_id = req.oidc.user.sub;
    const { subject } = req.body;
    const fullPath = path.join(baseDir, subject);

    fs.mkdirSync(fullPath, { recursive: true });

    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export { upload };
