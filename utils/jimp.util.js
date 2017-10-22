const fs = require('fs'),
    Jimp = require('jimp'),
    config = require('config'),
    Promise = require("bluebird"),
    result = require('./result.util'),
    LOG = require('./logger.util')
    ;

function getMetaData(imagefile) {
    return (
        new Promise((resolve, reject) => {
            Jimp.read(imagefile)
            .then((image) => {
                resolve(Object.assign(image['_exif'].tags, {mimetype: image.getMIME()}));
            })
            .catch((err) => {
                LOG.error('Unable to read image metadata', err);
                reject(err);
            });
        })
    );
}

function getResizedImage(imagefile, _size) {
    return (
        new Promise((resolve, reject) => {
            Jimp.read(imagefile)
            .then((image) => {
                try {
                    image.clone().resize((_size.width === 'AUTO') ? Jimp.AUTO : +_size.width, 
                    (_size.height === 'AUTO') ? Jimp.AUTO : +_size.height)
                        .quality(100)
                        .getBuffer(image.getMIME(), (err, imageBuffer) => {
                            resolve(imageBuffer);
                        })
                } catch(e) {
                    let err_message = `Error occured while resizing ` +
                    `image in getResizedImage(): ${JSON.stringify(e)}`;
                    LOG.error(err_message);
                    reject(new Error(err_message));
                }
                
            })
            .catch((err) => {
                let err_message = `Error occured while reading `+
                `image in getResizedImage(): ${JSON.stringify(err)}`;
                LOG.error(err_message);
                reject(new Error(err_message));
            })
        })
    );
}

function getCroppedImage(imagefile, _crop) {
    return (
        new Promise((resolve, reject) => {
            Jimp.read(imagefile)
            .then((image) => {
                image.clone().crop(+_crop.x, 
                    +_crop.y,
                    +_crop.width, 
                    +_crop.height)
                    .quality(100)
                    .getBuffer(image.getMIME(), (err, imageBuffer) => {
                        resolve(imageBuffer);
                    })
            })
            .catch((err) => {
                LOG.error('Error occured while resizing image', err);
                reject(err);
            })
        })
    );
}

module.exports = {
    getMetaData,
    getResizedImage,
    getCroppedImage
};