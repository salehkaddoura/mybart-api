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
    console.log(process.env.API_KEY);
    getEtdColors().then(function(data) {
        console.log('###########');
        console.log(data.root.stations.station);
    });
    // request.get('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + process.env.API_KEY, function(error, response, body) {
    //     if (error) {
    //         res.status(500).send(error);
    //         return;
    //     }

        
        
    //     if (latitude && longitude && !error) {
    //         var options = { object: true };
    //         var stnJson = xmlParser.toJson(body, options);
    //         res.send(sortByLocation(latitude, longitude, stnJson.root.stations.station));
    //     } else {
    //         var options = { object: true };
    //         var stnJson = xmlParser.toJson(body, options);
    //         res.send(stnJson.root.stations.station);
    //     }
        
    // });
});


function getEtdColors() {
    var options = { object: true };
    return new Promise(function(resolve, reject) {
        rp('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=ALL&key=' + process.env.API_KEY).then(function(body) {
            var etdInfoJson = xmlParser.toJson(body, options);
            rp('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + process.env.API_KEY).then(function(data) {
                var stnInfoJson = xmlParser.toJson(data, options);
                for (var i = 0; i < stnInfoJson.root.stations.station.length; i++) {
                    etdInfoJson.root.station.map(function(station) {
                        if (stnInfoJson.root.stations.station[i].abbr === station.abbr) {
                            return stnInfoJson.root.stations.station[i].etd = station.etd;
                        }
                    });
                }
                
                resolve(stnInfoJson);
            });
        });    
    });
    

    // var etdInfo = request.get('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=ALL&key=' + process.env.API_KEY, function(error, response, body) {
    //     if (error) {
    //         return null;
    //     }

    //     var options = { object: true };
    //     var etdInfoJson = xmlParser.toJson(body, options);
    //     console.log('###########', etdInfoJson.root);
    //     return etdInfoJson.root;
    // });

    // var stnInfo = request.get('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + process.env.API_KEY, function(error, response, body) {
    //     if (error) {
    //         return null;
    //     }

    //     var options = { object: true };
    //     return xmlParser.toJson(body, options);
    // });

    // console.log('######################');
    // console.log(etdInfo);

    // Promise.all([ etdInfo, stnInfo ]).then(function(results) {
    //     console.log('THIS IS PROMISE');
    //     console.log(results);
    // });
}

function sortByLocation(lat, lon, stationData) {
    // console.log('##', stationData);
    //compute distances from point
    for (var i in stationData) {
        var stationObject = stationData[i];
        //calculate distance from point and add data to each station
        stationObject.distance = Math.sqrt(Math.pow(lat - stationData[i].gtfs_latitude, 2) + Math.pow(lon - stationData[i]. gtfs_longitude, 2));
    }
    
    return stable(stationData, function (a, b) {
        return a.distance > b.distance;
    });
}

module.exports = router;