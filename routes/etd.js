'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res) {
    request.get('http://bartjson.azurewebsites.net/api/etd.aspx?cmd=etd&orig=ALL&key=' + process.env.API_KEY, function(error, response, body) {
        if (error) {
            res.status(500).send(error);
            return;
        }

        res.send(JSON.parse(body));
    });
});

router.get('/:id', function(req, res) {
    if (typeof(req.params.id) === "undefined") {
        res.status(401).send({ message: 'Station ID required.' });
        return;
    }
    
    var station = req.params.id;

    request.get('http://bartjson.azurewebsites.net/api/etd.aspx?cmd=etd&orig=' + station + '&key=' + process.env.API_KEY, function(error, response, body) {
        if (error) {
            res.status(500).send(error);
            return;
        }

        res.send(JSON.parse(body));
    });
});

module.exports = router;