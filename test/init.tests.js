var assert = require('assert');

const Promise = require("bluebird"),
  { getDBConnection } = require('../utils/mongo.util'),
  { init } = require('../init'),
  LOG = require('../utils/logger.util'),
  { test_saveImages, test_getImages, 
    test_deleteImages, test_updateImage, 
    test_getImageById} = require('./crud.tests'),
  { test_getMetaData, test_getResizedImage, 
    test_getCroppedImage } = require('./jimp.tests')
  ;

before(function() {
  getDBConnection()
  .then((db) => {
    return db.dropDatabase();
  })
  .then((result) => {
    LOG.info(result);
  })
  .catch((err) => {
    LOG.error(err);
    done(err);
  })
});

function test_init() {
  return (
    new Promise((resolve, reject) => {
      describe('#init()', function() {
        it('should return ok', function(done) {
          init()
          .then((result) => {
            done();
            resolve();
          })
          .catch((result) => {
            done(result.error);
            reject(err);
          });
        });
      });
    })
  );
}

// Kick-start tests

test_init()
.then(() => {
  return test_saveImages();
})
.then(() => {
  return test_getImages();
})
.then(() => {
  return test_getImageById();
})
/*
.then(() => {
  return test_updateImage();
})
.then(() => {
  return test_deleteImages();
})
*/
.then(() => {
  LOG.info('Tests completed');
})
.catch((err) => {
  LOG.error(err);
});
