import multer from 'multer';
import { IMAGES_PATH } from '../utils/constants.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./public${IMAGES_PATH}`);
    },
    filename: function (req, file, cb) {
        cb(null, `${new Date().toISOString()}_${file.originalname}`);
    }
});

const fileFilter = (req, file, callback) => {
    callback(null, ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype));
};

export default multer({ storage: storage, fileFilter: fileFilter }).single('image');
