const Promise = require("bluebird"),
    EventEmitter = require('events'),
    ObjectId = require('mongodb').ObjectId,
    image_events = new EventEmitter(),
    { getDBConnection } = require('./mongo.util'),
    LOG = require('./logger.util'),
    config = require('config'),
    { getMetaData, getCroppedImage,
        getResizedImage } = require('../utils/jimp.util'),
    { initImagesFolder, 
        deleteFile, createFile } = require('../utils/image.files.util')
    ;
let server_config = config.get('server'),
    selfurl = `${server_config.scheme}:`
        +`//${server_config.host}:${server_config.port}`
        +`${server_config.context}`,
    thumbnail = config.get('thumbnail')
    ;
    

function saveImages(images) {
    return (
        new Promise((resolve, reject) => {
            getDBConnection()
            .then((db) => {
                let images_collection = db.collection(config.get('db').collection);
                return images_collection.insertMany(images);
            })
            .then((response) => {
                image_events.emit('save', response.ops.slice(0));
                resolve(response.insertedCount);
            })
            .catch((err) => {
                LOG.error(`Failed to insert images: ${JSON.stringify(images)}`, err);
                reject(err);
            })
        })
    );
}

function getImages(_user, _name) {
    return (
        new Promise((resolve, reject) => {
            getDBConnection()
            .then((db) => {
                let images_collection = db.collection(config.get('db').collection);
                let resultPromise = null;
                if (_name) {
                    resultPromise = images_collection.find({user:_user, name: new RegExp(_name, 'i') }).toArray();
                } else {
                    resultPromise = images_collection.find({user:_user}).toArray();
                }
                return resultPromise;
            })
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                LOG.error(`Error occured while fetching images for user: ${_user}`, err);
                reject(err);
            })
        })
    );
}

function updateImage(image) {
    return (
        new Promise((resolve, reject) => {
            getDBConnection()
            .then((db) => {
                let images_collection = db.collection(config.get('db').collection);
                return images_collection.updateOne(
                    {   user:image.user, 
                        filename: image.filename
                    }, 
                    {
                        $set: {
                            user: image.user,
                            name: image.name,
                            filename: image.filename,
                            mimetype: image.mimetype,
                            path: image.path,
                            encoding: image.encoding,
                            size: image.size,
                            height: image.height,
                            width: image.width,
                            url: image.url
                        }
                    });
            })
            .then((response) => {
                resolve(response.modifiedCount);
            })
            .catch((err) => {
                LOG.error(`Failed to update image: ${JSON.stringify(image)}`, err);
                reject(err);
            })
        })
    );
}

function deleteImages(images) {
    return (
        new Promise((resolve, reject) => {
            let _ids = images.map((img) => {
                return new ObjectId(img['_id']);
            });
            getDBConnection()
            .then((db) => {
                let images_collection = db.collection(config.get('db').collection);
                return images_collection.remove({_id: {'$in': _ids}});
            })
            .then((response) => {
                image_events.emit('delete', images);
                resolve(response.result);
            })
            .catch((err) => {
                LOG.error(`Failed to remove images`, err);
                reject(err);
            })
        })
    );
}

function getImageById(id) {
    return (
        new Promise((resolve, reject) => {
            getDBConnection()
            .then((db) => {
                let images_collection = db.collection(config.get('db').collection);            
                return images_collection.findOne({'_id': new ObjectId(id)});
            })
            .then((result) => {                
                resolve(result);
            })
            .catch((err) => {
                LOG.error(`Error occured while fetching image by id: ${id}`, err);
                reject(err);
            })
        })
    );
}

// Even subscribers

function onSave(images) {
    let image = images.shift();
    if (image) {
       getMetaData(image.path)
        .then((metadata) => {
            image.height = metadata['ExifImageHeight'];
            image.width = metadata['ExifImageWidth'];
            image.url = `${selfurl}/api/file/${image['_id']}`;
            return updateImage(image);
        })
        .then((update_result) => {
            return onSave(images);
        })
        .catch((err) => {
            LOG.error('Error occured updating image with size info', err);
            onSave(images);
        })
    }
}

function onDelete(images) {
    let image = images.shift();
    if (image) {
        deleteFile(image.path)
        .then((delete_message) => {
            LOG.info(delete_message);
            onDelete(images);
        })
        .catch((err) => {
            LOG.error('Error occured while deleting file', err);
            onDelete(images);
        })
    }
}

image_events.on('save', (images) => {
    // do on save event
    onSave(images);
});

image_events.on('delete', (images) => {
    // do on delete event
    onDelete(images);
});
    



module.exports = {
    saveImages, // C
    getImages, // R
    getImageById,
    updateImage, // U
    deleteImages // D
};