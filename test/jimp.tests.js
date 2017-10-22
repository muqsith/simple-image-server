var assert = require('assert');

const fs = require('fs'),
    Promise = require("bluebird"),
    {   getMetaData,
        getCroppedImage,
        getResizedImage
    } = require('../utils/jimp.util'),
    LOG = require('../utils/logger.util')
    ;

exports.test_getMetaData = function() {
    return (
        new Promise((resolve, reject) => {
            describe('#getMetaData()', function() {
                it('get image metadata', function(done) {
                    this.timeout(5000);
                    getMetaData('/Users/muqsithirfan/Pictures/temp/IMG_20171014_130955480.jpg')
                    //getMetaData('/tmp/simple-image-server/8c66e95f14feadf6105ae35f22052e15')
                    .then((metadata) => {
                        LOG.info(JSON.stringify(metadata));
                        done();
                        resolve();
                    })
                    .catch((err) => {
                        LOG.error(err);
                        done(err);
                        reject(err);
                    });
                });
            });
        })
    );
}

exports.test_getResizedImage = function() {
    return (
        new Promise((resolve, reject) => {
            describe('#getResizedImage()', function() {
                it('get resized image', function(done) {
                    getResizedImage('/Users/muqsithirfan/Pictures/temp/IMG_20171014_130955480.jpg', 
                        {width: 200, height: 300}
                    )
                    .then((imageBuffer) => {
                        fs.writeFile('/Users/muqsithirfan/Pictures/temp/resized.jpg', imageBuffer, 
                            'binary', (err) => {
                            if (err) {
                                done(err);
                                reject(err);
                            } else {
                                done();
                                resolve();
                            }
                        });
                    })
                    .catch((err) => {
                        LOG.error(err);
                        done(err);
                        reject(err);
                    });
                });
            });
        })
    );
}

exports.test_getCroppedImage = function() {
    return (
        new Promise((resolve, reject) => {
            describe('#getCroppedImage()', function() {
                it('get cropped image', function(done) {
                    getCroppedImage('/Users/muqsithirfan/Pictures/temp/IMG_20171014_130955480.jpg', 
                    {x:100, y: 200, width: 800, height: 1600})
                    .then((imageBuffer) => {
                        fs.writeFile('/Users/muqsithirfan/Pictures/temp/cropped.jpg', imageBuffer, 
                        'binary', (err) => {
                            if (err) {
                                done(err);
                                reject(err);
                            } else {
                                done();
                                resolve();
                            }
                        });
                    })
                    .catch((err) => {
                        LOG.error(err);
                        done(err);
                        reject(err);
                    });
                });
            });
        })
    );
}