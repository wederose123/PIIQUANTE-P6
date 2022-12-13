const multer = require('multer');

//permet de recupere les type d'image
const MIME_TYPE = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
}

const storage = multer.diskStorage({

    destination: (req, res, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extention = MIME_TYPE[file.mimetype];
        callback(null, name + Date.now() + '.' + extention)
    }
});

module.exports = multer({ storage }).single("image")

//mukter permet de recuperer les image dans un dossier image 