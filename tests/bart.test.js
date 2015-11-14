// 'use strict';
var superagent = require('superagent');
var expect = require('expect.js');

var baseUrl = 'http://localhost:8080/v1'

describe('check api health', function() {
    it('will get api health', function(done) {
        superagent.get(baseUrl + '/health')
            .end(function(e, res) {
                expect(e).to.eql(null);
                expect(res.body.status).to.eql('ok');

                done();
            });    
    }) 
});

describe('testing station routes', function() {
    it('will get all stations', function(done) {
        superagent.get(baseUrl + '/stations')
            .end(function(e, res) {
                expect(e).to.eql(null);
                expect(res.body.root).to.be.an('object');
                expect(res.body.root.uri).to.eql('http://api.bart.gov/api/stn.aspx?cmd=stns');
                expect(res.body.root.stations.station).to.be.an('array');

                done();
            })
    })
});