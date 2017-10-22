const config = require('config'),
    Promise = require("bluebird"),
    result = require('./utils/result.util'),
    LOG = require('./utils/logger.util'),
    { initImagesFolder } = require('./utils/image.files.util'),
    { getDBConnection, createAndIndexCollection } = require('./utils/mongo.util')
    ;



function init() {
    return (
        Promise.all([initImagesFolder(), getDBConnection(), createAndIndexCollection()])
        .then((values) => {
            LOG.info('System initialization successful');
        })
        .catch((err) => {
            LOG.error('System failed to initialize', err);
            throw err;
        })
    );
}

module.exports = {
    init
};