var assert = require('assert');

const fs = require('fs'),
    Promise = require("bluebird"),
    {   getMetaData,
        getResizedImage
    } = require('../utils/sharp.util'),
    LOG = require('../utils/logger.util')
    ;

exports.test_getMetaData = function() {
    return (
        new Promise((resolve, reject) => {
            describe('#getMetaData()', function() {
                it('get image metadata', function(done) {
                    this.timeout(5000);
                    getMetaData('/Users/muqsithirfan/Pictures/IMG_20171014_130955480.jpg')
                    //getMetaData('/Users/muqsithirfan/Pictures/closeup.png')
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
                    getResizedImage('/Users/muqsithirfan/Pictures/IMG_20171014_130955480.jpg', 
                        {width: 'AUTO', height: 100}
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
