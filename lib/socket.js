//Socket functions

//Load db stuff
var dblib = require(__dirname + '/db.js');
var messagelib = require(__dirname + '/messages.js');
//init db library
var db = new dblib();

module.exports = function(io){

  var numUsers = 0;

  //initialize the connection and prepare each of the event listeners
  this.init = function(){
    io.on('connection', function(socket){
      var addedUser = false;
      console.log('a user connected');

      populate_messages(socket);
      new_message(socket);
      add_user(socket, addedUser);
      disconnect(socket, addedUser);

    });
  }

  function new_message(socket) {
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
  }

  function add_user(socket, addedUser){
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
  }

  function populate_messages(socket) {
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
  }

  function disconnect(socket, addedUser){
    socket.on('disconnect', function(){
      if (addedUser){
        --numUsers;

        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers
        });
      }
    });
  }
  
}
