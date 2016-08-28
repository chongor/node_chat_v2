var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

const views = path.join(__dirname, './views');

//Load db stuff
var dblib = require('./middle/db.js');
var messagelib = require('./lib/messages.js');
//init db library
var db = new dblib();

//Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom stuff

var numUsers = 0;

io.on('connection', function(socket){
  var addedUser = false;
  console.log('a user connected');

  //new message
  socket.on('new message', function(data){
    console.log('new message: ' + data);

    //create message to save to mongo
    var messageObj = {
      username: socket.username,
      message: data.message,
      time_created : data.date_created
    };

    //instantiate a message instance
    var messageinst = new messagelib();

    db.init(function(connection){
      messageinst.addMessage(messageObj, function(result, date){
        db.close(connection);
        //message has been successfully created
        if(result){
          console.log("message created");
          socket.broadcast.emit('new message', {
            username: socket.username,
            message: data.message,
            time_created: date
          });
        }
        //message failed to write
        else {
          console.log('messaged failed to be created')
        }
      });
    });


  });

  //add user
  socket.on('add user', function(username){
    if (addedUser) return;

    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });

    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // GET all messages, send list to client
  socket.on('populate messages', function(){

    //instantiate new message instance
    var messageinst = new messagelib();

    db.init(function(connection){
      messageinst.getMessages(function(result, message_list){
        //close db connection
        db.close(connection);
        //message has been successfully created
        if(result && message_list){
          socket.emit('populate messages', {
            message_list: message_list
          });
        }
        //get messages successful, no messages stored
        else if (result && message_list == null){
          console.log('no messages in db');
        }
        //failed to get messages
        else {
          console.log("failed to get messages");
        }
      });
    });
  });

  socket.on('disconnect', function(){
    if (addedUser){
      --numUsers;

      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

});

//routes
app.get('/', function(req,res){
  res.sendFile(views + '/index.html');
});


http.listen(8080, function(){
  console.log("listening on http://localhost:8080");
});
