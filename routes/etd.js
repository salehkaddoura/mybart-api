'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res) {
    request.get('http://bartjson.azurewebsites.net/api/etd.aspx?cmd=etd&orig=ALL&key=MW9S-E7SL-26DU-VV8V', function(error, response, body) {
        if (error) {
            res.status(500).send(error);
            return;
        }

        res.send(JSON.parse(body));
    });
});

router.get('/:id', function(req, res) {
    var station = req.params.id;

    request.get('http://bartjson.azurewebsites.net/api/etd.aspx?cmd=etd&orig=' + station + '&key=MW9S-E7SL-26DU-VV8V', function(error, response, body) {
        if (error) {
            res.status(500).send(error);
            return;
        }

        res.send(JSON.parse(body));
    });
});

module.exports = router;