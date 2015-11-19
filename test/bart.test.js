'use strict';
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
                // console.log(res.body);
                expect(res.body).to.be.an('array');

                done();
            });
    })

    it('will get closest station using lat and long as query params', function(done) {
        superagent.get(baseUrl + '/stations?lat=37.747269&lon=-122.434763')
            .end(function(e, res) {
                expect(e).to.eql(null);
                // console.log(res.body);
                expect(res.body).to.be.an('array');

                done();
            });
    })
});

describe('testing etd routes', function() {
    it('will get all etd stations', function(done) {
        superagent.get(baseUrl + '/etd')
            .end(function(e, res) {
                expect(e).to.eql(null);
                // console.log(res.body);
                expect(res.body).to.be.an('array');

                done();
            });
    })

    it('will get etd of stations by param', function(done) {
        superagent.get(baseUrl + '/etd/UCTY')
            .end(function(e, res) {
                expect(e).to.eql(null);
                // console.log(res.body);  
                expect(res.body).to.be.an('array');
                expect(res.body[0].name[0]).to.eql('Union City');
                expect(res.body[0].abbr[0]).to.eql('UCTY');

                done();
            });
    })
});
