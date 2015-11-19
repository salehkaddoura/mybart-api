'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');
var xmlParser = require('xml2json');

router.get('/', function(req, res) {
    request.get('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=ALL&key=' + process.env.API_KEY, function(error, response, body) {
        if (error) {
            res.status(500).send(error);
            return;
        }

        var options = { object: true, arrayNotation: true, sanitize: true };
        var stnJson = xmlParser.toJson(body, options);
        res.send(stnJson.root[0].station);
    });
});

router.get('/:id', function(req, res) {    
    var station = req.params.id;

    request.get('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=' + station + '&key=' + process.env.API_KEY, function(error, response, body) {
        if (error) {
            res.status(500).send(error);
            return;
        }

        var options = { object: true, arrayNotation: true, sanitize: true };
        var stnJson = xmlParser.toJson(body, options);
        res.send(stnJson.root[0].station);
    });
});

module.exports = router;