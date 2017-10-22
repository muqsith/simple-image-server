var assert = require('assert');

const Promise = require("bluebird"),
    LOG = require('../utils/logger.util'),
    { saveImages, getImages, getImageById,
        deleteImages, updateImage } = require('../utils/images.collection.util')
    ;

let data = require('./data/sample-images.json')
    ;

exports.test_saveImages = function() {
    return (
        new Promise((resolve, reject) => {
            describe('#saveImages()', function() {
                it('should return insert count (that is greater than 1)', function(done) {
                    saveImages(data)
                    .then((count) => {
                        assert.ok(count > 1);
                        done();
                        resolve();
                    })
                    .catch((err) => {
                        LOG.error('Error occured while saving many images', err);
                        done(err);
                        reject(err);
                    })
                })
            });
        })
    );
}

exports.test_getImages = function() {
    return (
        new Promise((resolve, reject) => {
            describe('#getImages()', function() {
                it('should return images for user', function(done) {
                    getImages('muqsith')
                    .then((result) => {
                        LOG.info(result.length);
                        done();
                        resolve();
                    })
                    .catch((err) => {
                        done(err);
                        reject(err);
                    });
                });
            });
        })
    );
}

exports.test_getImageById = function() {
    return (
        new Promise((resolve, reject) => {
            describe('#getImageById()', function() {
                it('should return images for user', function(done) {
                    getImages('muqsith')
                    .then((result) => {
                        let id = result[1]['_id'].toString();
                        return getImageById(id);
                    })
                    .then((doc) => {
                        if (doc === null) 
                            throw Error('Muqsith');
                        done();
                        resolve();
                    })
                    .catch((err) => {
                        done(err);
                        reject(err);
                    });
                });
            });
        })
    );
}

exports.test_deleteImages = function() {
    return (
        new Promise((resolve, reject) => {
            describe('#deleteImages()', function() {
                it('should delete images for user muqsith', function(done) {
                    getImages('muqsith')
                    .then((images) => {
                        return deleteImages(images);
                    })
                    .then((r) => {
                        LOG.info(JSON.stringify(r));
                        done();
                        resolve();
                    })
                    .catch((err) => {
                        done(err);
                        reject(err);
                    });
                });
            });
        })
    );
}

exports.test_updateImage = function() {
    return (
        new Promise((resolve, reject) => {
            describe('#updateImage()', function() {
                it('should update image for user muqsith', function(done) {
                    getImages('muqsith')
                    .then((result) => {
                        let img = result[2];
                        img.width = 100;
                        img.height = 150;
                        return updateImage(img);
                    })
                    .then((result) => {
                        LOG.info(result);
                        done();
                        resolve();
                    })
                    .catch((err) => {
                        done(err);
                        reject();
                    });
                });
            });
        })
    );
}
