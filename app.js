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
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", 
                "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        
        app.use(server_config.context, express.static('public'));
        app.use(`${server_config.context}/api`, imagesrouter);
        
        app.listen(server_config.port, () => {
            console.log(`App running => http://localhost:${server_config.port}${server_config.context}`);
        });
    })
    .catch((err) => {
        LOG.error('', err);
    })
;



