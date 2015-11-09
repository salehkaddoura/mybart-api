'use strict';
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');

var port = process.env.PORT || 8080;

app.use(morgan('short'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next){
    console.log('something is happening');
    next();
});

app.get('/', function(req, res) {
    res.status(200).json({ message: "hey" });
});

// routes
app.use('/', require('./routes/site'));
app.use('/v1/stations', require('./routes/stations'));
app.use('/v1/etd', require('./routes/etd'));

app.listen(port);
console.log("The magic happens on port: ", port);