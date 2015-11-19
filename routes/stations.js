'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');
var stable = require('stable');
var xmlParser = require('xml2json');
var Promise = require('bluebird');
var rp = require('request-promise');

router.get('/', function(req, res) {
    var latitude = req.query.lat;
    var longitude = req.query.lon;
    
    mergeEtdWithStations().then(function(data) {
        var stationData = data.root[0].stations[0].station;
        if (latitude && longitude) {
            res.send(sortByLocation(latitude, longitude, stationData));
        } else {
            res.send(stationData);    
        }
    }).catch(function(e) {
        res.status(401).send(e);
    });
});


function mergeEtdWithStations() {
    // xml2json options
    var options = { object: true, arrayNotation: true, sanitize: true };
    // creating a promise to return all station data with ETD times
    return new Promise(function(resolve, reject) {
        rp('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=ALL&key=' + process.env.API_KEY).then(function(body) {
            var etdInfoJson = xmlParser.toJson(body, options);   
            rp('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + process.env.API_KEY).then(function(data) {
                var stnInfoJson = xmlParser.toJson(data, options);    
                for (var i = 0; i < stnInfoJson.root[0].stations[0].station.length; i++) {
                    etdInfoJson.root[0].station.map(function(station) {
                        if (stnInfoJson.root[0].stations[0].station[i].abbr[0] === station.abbr[0]) {
                            return stnInfoJson.root[0].stations[0].station[i].etd = station.etd;
                        }
                    });
                }
                
                resolve(stnInfoJson);
            }).catch(function(err) {
                reject(err);
            });
        }).catch(function(err) {
            reject(err);
        });   
    });
}

function sortByLocation(lat, lon, stationData) {
    //compute distances from point
    for (var i in stationData) {
        var stationObject = stationData[i];
        //calculate distance from point and add data to each station
        stationObject.distance = Math.sqrt(Math.pow(lat - stationData[i].gtfs_latitude, 2) + Math.pow(lon - stationData[i].gtfs_longitude, 2));
    }
    
    return stable(stationData, function (a, b) {
        return a.distance > b.distance;
    });
}

module.exports = router;