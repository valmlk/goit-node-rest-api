import multer from 'multer';
import path from 'path';

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'tmp'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: multerConfig,
});
