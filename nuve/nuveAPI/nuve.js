/*global exports, require, console, Buffer, __dirname*/
var express = require('express');
var db = require('./mdb/dataBase').db;
var rpc = require('./rpc/rpc');
var logger = require('./logger').logger;

// Logger
var log = logger.getLogger("Nuve");

var app = express();

rpc.connect();

var nuveAuthenticator = require('./auth/nuveAuthenticator');

var roomsResource = require('./resource/roomsResource');
var roomResource = require('./resource/roomResource');
var tokensResource = require('./resource/tokensResource');
var servicesResource = require('./resource/servicesResource');
var serviceResource = require('./resource/serviceResource');
var usersResource = require('./resource/usersResource');
var userResource = require('./resource/userResource');

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.set('view engine', 'ejs');
app.set('view options', {
    layout: false
});

app.use(function (req, res, next) {
    "use strict";

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, authorization, content-type');

    next();
});

app.get('/test', function (req, res) {
    "use strict";

    res.render('test');
});

app.options('*', function(req, res) {
    res.send(200);
});

app.get('*', nuveAuthenticator.authenticate);
app.post('*', nuveAuthenticator.authenticate);
app.delete('*', nuveAuthenticator.authenticate);

app.post('/rooms', roomsResource.createRoom);
app.get('/rooms', roomsResource.represent);

app.get('/rooms/:room', roomResource.represent);
app.delete('/rooms/:room', roomResource.deleteRoom);

app.post('/rooms/:room/tokens', tokensResource.create);

app.post('/services', servicesResource.create);
app.get('/services', servicesResource.represent);

app.get('/services/:service', serviceResource.represent);
app.delete('/services/:service', serviceResource.deleteService);

app.get('/rooms/:room/users', usersResource.getList);

app.get('/rooms/:room/users/:user', userResource.getUser);
app.delete('/rooms/:room/users/:user', userResource.deleteUser);

app.listen(3000);
