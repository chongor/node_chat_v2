//Routes for node_chat

var dblib = require('../middle/db.js');
var messagelib = require('../lib/messages.js');
var path = require('path');

const views = path.join(__dirname, '../views');
var db = new dblib();
var socketStore = {};

module.exports = function(io){

  this.home = function(req,res,next){

    io.on('connection', function(socket){
      console.log('a user connected');
      socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
      });
      socket.on('disconnect', function(){
        console.log('user diconnected');
      });
    });

    res.sendFile(views + '/index.html');
  }


  //test adding messages
  this.test = function(req,res,next){

    var messageinst = new messagelib();

    //test getting data
    db.init(function(connection){
      messageinst.getMessages(2, function(message_list){
        db.close(connection);
        //message has been successfully created
        if(message_list){
          res.render('test');
        }
        //message failed to write
        else {
          res.redirect(302, "/?error=1");
        }
      });
    });

    // //create the message object
    // var messageObj = {
    //   username: 'Anon',
    //   message: 'harro'
    // };
    //
    // var messageinst = new messagelib();
    // db.init(function(connection){
    //   messageinst.addMessage(messageObj, function(message_result){
    //     db.close(connection);
    //     //message has been successfully created
    //     if(message_result){
    //       console.log("message created")
    //       res.sendFile(views + '/index.html');
    //     }
    //     //message failed to write
    //     else {
    //       res.redirect(302, "/?error=1");
    //     }
    //   });
    // });
  }

  this.message_POST = function(req,rex,next){
    //take message + user who posted to save into the db

    //create the message object
    var messageObj = {
      username: req.body.username,
      message: req.body.message
    };

    //connect to db and write
    var db = new dblib();
    var messageinst = new messagelib();
    db.init(function(connection){
      messageinst.addMessage(messageObj, function(message_result){
        db.close(connection);
        //message has been successfully created
        if(message_result){

        }
        //message failed to write
        else {
          res.redirect(302, "/?error=1");
        }
      });
    });
  }
};
