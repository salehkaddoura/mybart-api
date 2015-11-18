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
        if (latitude && longitude) {
            res.send(sortByLocation(latitude, longitude, data.root[0].stations[0].station));
            // res.send(sortByLocation(latitude, longitude, data.root.stations.station));
        } else {
            console.log('######################');
            console.log(data.root[0].stations[0].station);
            // res.send(data.root.stations.station);
            res.send(data.root[0].stations[0].station);    
        }
    }).catch(function(e) {
        res.status(401).send(e);
    });
});


function mergeEtdWithStations() {
    var options = { object: true, arrayNotation: true, sanitize: true };
    return new Promise(function(resolve, reject) {
        rp('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=ALL&key=' + process.env.API_KEY).then(function(body) {
            var etdInfoJson = xmlParser.toJson(body, options);
            // console.log('### ETDINFOJSON #######');
            // console.log(etdInfoJson.root[0].station[0]);    
            rp('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + process.env.API_KEY).then(function(data) {
                var stnInfoJson = xmlParser.toJson(data, options);
                // console.log('### STNINFOJSON ');
                // console.log(stnInfoJson.root[0].stations[0]);    
                for (var i = 0; i < stnInfoJson.root[0].stations[0].station.length; i++) {
                    etdInfoJson.root[0].station.map(function(station) {
                        // console.log(station.abbr[0]);
                        if (stnInfoJson.root[0].stations[0].station[i].abbr[0] === station.abbr[0]) {
                            // console.log('hit');
                            return stnInfoJson.root[0].stations[0].station[i].etd = station.etd;
                        }
                    });
                }
                
                // console.log(stnInfoJson.root[0].stations[0].station[0]);
                resolve(stnInfoJson);
            }).catch(function(err) {
                console.log('## ERROR ##');
                console.log(err);
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