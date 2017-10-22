const path = require('path'),
    Promise = require("bluebird"),
    express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    config = require('config'),
    result = require('../utils/result.util'),
    LOG = require('../utils/logger.util'),
    { getNewImage } = require('../models/image'),
    { saveImages, getImages, getImageById,
        updateImage,  
        deleteImages } = require('../utils/images.collection.util'),
    { getMetaData, getResizedImage,
        getCroppedImage } = require('../utils/jimp.util'),
    { getFile } = require('../utils/image.files.util'),
    { getSizeFromSizeString } = require('../utils/generic.util')
;

// currently hard coded user, user should be extracted from request Authentication header (bearer).
let user = 'muqsith';

let upload = multer({ dest: path.resolve(config.get('destination'))})
    ;

function getImageObject(_file) {
    let image = getNewImage();
    image.user = user;
    image.name = _file.originalname;
    image.filename = _file.filename;
    image.encoding = _file.encoding;
    image.mimetype = _file.mimetype;
    image.path = _file.path;
    image.size = _file.size;
    return image;
}

function getImagesFromRequest(request) {
    let images = [];
    let _files = request.files;
    if (_files && Array.isArray(_files) && _files.length > 0) {
        for (let _file of _files) {
            images = images.concat(getImageObject(_file));
        }
    }
    return images;
}

// upload images
router.post('/', upload.array('images', +config.get('upload').maxcount), (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.files && req.files.length > 0) {
        let images = getImagesFromRequest(req);
        saveImages(images)
        .then((count) => {
            let _message = `Successfully saved ${count} images.`;
            LOG.info(_message);
            res.send(Object.assign({}, result.success, {message: _message}));
        })
        .catch((err) => {
            if (err) {
                LOG.error('Failed to save images', err);
                res.send({}, Object.assign(result.error, {message: 'Failed to save images.'}));
            }            
        })
    } else {
        res.send(Object.assign({}, result.success, {message:'No files attached.'}));
    }    
});

// get images for user
router.get('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    getImages(user)
    .then((images) => {
        res.send(Object.assign({}, result.success, {images}));
    })
    .catch((err) => {
        res.send(Object.assign({}, result.error, {message: 'Failed to fetch images.'}));
    })
});

// get image
router.get('/file/*', (req, res) => {
    let id = undefined;
    let size_str = undefined;
    if (req.params[0]) {
        let path_params = req.params[0].split('/');
        id = path_params[0];
        size_str = path_params[1];
    }
    let image = undefined;
    if (!id) {
        res.set('Content-Type', 'application/json');
        res.send(Object.assign({}, result.error, {message: 'Invalid URL'}));
    } else {
        getImageById(id)
        .then((doc) => {
            image = doc;
            let size = getSizeFromSizeString(size_str);
            if (size.width !== -1 && size.height !== -1) {
                return getResizedImage(image.path, size);
            } else {
                return getFile(image.path);
            }
        })
        .then((_buf) => {
            res.set('Content-Type', image.mimetype);
            res.send(_buf);
        })
        .catch((err) => {
            res.set('Content-Type', 'application/json');
            res.send(Object.assign({}, result.error, {message: JSON.stringify(err)}));
        })
    }
});


/*
TODO: Below methods to be implemented further

// get cropped image
router.get('/crop', (req, res) => {
    let image = req.body['image'];
    let crop = req.body['crop'];
    getCroppedImage(image.path, crop)
    .then((_buf) => {
        res.set('Content-Type', image.mimetype);
        res.send(_buf);
    })
    .catch((err) => {
        res.set('Content-Type', 'application/json');
        res.send(Object.assign({}, result.error, {message: JSON.stringify(err)}));
    })
});

// save updated image

router.post('/update', (req, res) => {
    let image = req.body('image');
    getFile(image.path)
    .then((_buf) => {
        res.set('Content-Type', image.mimetype);
        res.send(_buf);
    })
    .catch((err) => {
        res.set('Content-Type', 'application/json');
        res.send(err);
    })
});
*/


module.exports = router;