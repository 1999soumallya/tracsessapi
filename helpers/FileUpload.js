const multer = require("multer");

exports.imageUpload = multer({
    fileFilter: (req, file, cb) => {
        if (/image/.test(file.mimetype)) {
            cb(null, true);
        } else {
            req.imageValidationError = "This image type is not acceptable";
            return cb(req.fileValidationError, true);
        }
    }
}).single('image')