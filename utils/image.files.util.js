const fs = require('fs'),
    config = require('config'),
    Promise = require("bluebird"),
    result = require('./result.util'),
    LOG = require('./logger.util')
;

function initImagesFolder() {
    try {
        let imagesFolder = config.get('destination');
        if (!fs.existsSync(imagesFolder)) {
            // create folder
            fs.mkdirSync(imagesFolder);
        }
        return result.returnSuccess('Images folder successfully created.');
    } catch(e) {
        let errorMessage = 'Error occured while creating folder to store images';
        LOG.error(errorMessage, e);
        return result.returnError(errorMessage);
    }    
}

function deleteFile(filepath) {
    return (
        new Promise((resolve, reject) => {
            fs.unlink(filepath, (err) => {
                if (err) {
                    LOG.error(`Failed to delete file ${filepath}`, err);
                    reject(err);
                } else {
                    resolve(`Successfully deleted file ${filepath}`);
                }
            });
        })
    );
}

function createFile(filepath, _buffer) {
    return (
        new Promise((resolve, reject) => {
            fs.writeFile(filepath, _buffer, 
            'binary', (err) => {
                if (err) {
                    LOG.error(`Failed to create file ${filepath}`, err);
                    reject(err);
                } else {
                    resolve(`Successfully created file ${filepath}`);
                }
            });
        })
    );
}

function getFile(filepath) {
    return (
        new Promise((resolve, reject) => {
            fs.readFile(filepath, (err, data) => {
                if (err) {
                    LOG.error('Error occured while reading file', err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    );
}

module.exports = {
    initImagesFolder,
    deleteFile,
    createFile,
    getFile
};