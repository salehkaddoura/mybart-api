'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');
var stable = require('stable');
var xmlParser = require('xml2json');

router.get('/', function(req, res) {
    var latitude = req.query.lat;
    var longitude = req.query.lon;
    console.log(process.env.API_KEY);
    request.get('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + process.env.API_KEY, function(error, response, body) {
        if (error) {
            res.status(500).send(error);
            return;
        }
        
        if (latitude && longitude && !error) {
            var options = { object: true };
            var stnJson = xmlParser.toJson(body, options);
            res.send(sortByLocation(latitude, json));
        } else {
            var options = { object: true };
            var stnJson = xmlParser.toJson(body, options);
            res.send(stnJson);
        }
        
    });
});

function sortByLocation(lat, lon, stationData) {
    //compute distances from point
    for (var i in stationData) {
        var stationObject = stationData[i];
        //calculate distance from point and add data to each station
        stationObject.distance = Math.sqrt(Math.pow(lat - stationData[i].latitude, 2) + Math.pow(lon - stationData[i].longitude, 2));
    }
    
    return stable(stationData, function (a, b) {
        return a.distance > b.distance;
    });
}

module.exports = router;