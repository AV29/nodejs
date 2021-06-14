import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    filename: function (req, file, cb) {
        cb(null, `${new Date().toISOString()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, callback) => {
    callback(null, ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype));
};

export default multer({ storage: storage, fileFilter: fileFilter }).single('image');
