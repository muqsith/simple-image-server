const config = require('config'),
    Promise = require("bluebird"),
    result = require('./result.util'),
    LOG = require('./logger.util'),
    MongoClient = require('mongodb').MongoClient
    ;

let db = undefined
    ;

function dbOnClose() {
    db = undefined;
    LOG.info('Mongodb connection closed.');
}


function dbOnOpen() {
    LOG.info('Mongodb connection opened.');
}


function getDBConnection() {
    return (
        new Promise((resolve, reject) => {
            if (db) {
                resolve(db);
            } else {
                MongoClient.connect(config.get('db').path, (err, _db) => {
                    if (err) {
                        LOG.error('Error occured while connecting to the database', err);
                        reject(Object.assign(result.error, { message:'Error occured while connecting to the Database',
                             error: err}));
                    } else {
                        db = _db;
                        dbOnOpen();
                        db.on('close', dbOnClose);
                        LOG.info("Connected successfully to server");
                        resolve(db);
                    }        
                });
            }
        })
    );
}

function createAndIndexCollection() {
    return (
        new Promise((resolve, reject) => {
            getDBConnection()
            .then((db) => {
                let images_collection = db.collection(config.get('db').collection);
                return images_collection.createIndex({user: 'text', name: 'text'});
            })
            .then((response) => {
                LOG.info(response);
                resolve(response);
            })
            .catch((err) => {
                LOG.error(err);
                reject(err);
            })
        })
    );
}





module.exports = {
    getDBConnection,
    createAndIndexCollection
};