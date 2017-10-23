const fs = require('fs'),
    sharp = require('sharp'),
    config = require('config'),
    Promise = require("bluebird"),
    result = require('./result.util'),
    LOG = require('./logger.util')
    ;

function getMetaData(imagefile) {
    return (
        new Promise((resolve, reject) => {
            let image = sharp(imagefile);
            image.metadata()
            .then((metadata) => {
                // "format":"jpeg","width":2340,"height":4160
                resolve(Object.assign({}, 
                    {
                        format: metadata.format,
                        width: metadata.width,
                        height: metadata.height
                    }
                ));
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
            let image = sharp(imagefile);
            image.clone().resize((_size.width === 'AUTO') ? undefined : +_size.width, 
            (_size.height === 'AUTO') ? undefined : +_size.height)
            .toBuffer()
            .then((imageBuffer) => {
                resolve(imageBuffer);
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

module.exports = {
    getMetaData,
    getResizedImage
};