const express = require('express'),
    app = express(),
    Promise = require("bluebird"),
    bodyParser = require('body-parser'),
    imagesrouter = require('./routes/images-router'),
    config = require('config'),
    { init } = require('./init'),
    LOG = require('./utils/logger.util')
;

init()
    .then((result) => {
        let server_config = config.get('server');
        let selfurl = `${server_config.scheme}:`
                +`//${server_config.host}:${server_config.port}`
                +`${server_config.context}`;
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", 
                "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        
        app.use(express.static('public'));
        app.use(server_config.context, imagesrouter);
        
        app.listen(server_config.port, () => {
            console.log(`App running => ${selfurl}`);
        });
    })
    .catch((err) => {
        LOG.error('', err);
    })
;



