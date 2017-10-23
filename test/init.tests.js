var assert = require('assert');

const Promise = require("bluebird"),
  { getDBConnection } = require('../utils/mongo.util'),
  { init } = require('../init'),
  LOG = require('../utils/logger.util'),
  { test_saveImages, test_getImages, 
    test_deleteImages, test_updateImage, 
    test_getImageById} = require('./crud.tests'),
    /*
  { test_getMetaData, test_getResizedImage, 
    test_getCroppedImage } = require('./jimp.tests')
    */
    { test_getMetaData, test_getResizedImage } = require('./sharp.tests')
  ;

before(function() {
  
});

function test_init() {
  return (
    new Promise((resolve, reject) => {
      getDBConnection()
      .then((db) => {
        return db.dropDatabase();
      })
      .then((result) => {
        LOG.info(result);
        // testcase goes here
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
      .catch((err) => {
        LOG.error(err);
        done(err);
      });
      
    })
  );
}

// Kick-start tests
/*
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

.then(() => {
  return test_updateImage();
})
.then(() => {
  return test_deleteImages();
})
*/
test_getMetaData()
.then(() => {
  return test_getResizedImage();
})
.then(() => {
  LOG.info('Tests completed');
})
.catch((err) => {
  LOG.error(err);
});
