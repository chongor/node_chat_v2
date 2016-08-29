var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

const views = path.join(__dirname, './views');

//Load db stuff
var dblib = require('./lib/db.js');
var socketlib = require('./lib/socket.js');
var messagelib = require('./lib/messages.js');
//init library
var db = new dblib();
var socket = new socketlib(io);

//Routing
app.use(express.static(path.join(__dirname, 'public')));

// Initialize chatroom sockets
socket.init();

//route
app.get('/', function(req,res){
  res.sendFile(views + '/index.html');
});

//LIVE SERVER, LIVEEEE!!
http.listen(8080, function(){
  console.log("listening on http://localhost:8080");
});
