//Library for messages with MongoDB

var mongoose = require('mongoose');
var message = require('../models/message.js');

var Message = mongoose.model('Message', message.messageSchema);

module.exports = function(){
  //Read message

  /*
  *   Get all messages from present to past order
  *   can specify how many total messages to retrieve
  *   return a list of messages
  */
  this.getMessages = function(callback){
    Message.find({}).sort('-date').exec(function(err, messages){
      if (err){
        console.log(err);
        callback(false, null);
      } else if (messages.length == 0){
        console.log('no messages');
        callback(true, null);
      } else {
        console.log('messages found');
        callback(true, messages);
      }
    });
  }

  /*
  *   Create a message
  *   return true on success and false on failure
  */
  this.addMessage = function(data, callback){
    var message = new Message();
    message.username = data.username;
    message.message = data.message;

    message.save(function(err){
      if (err){
        console.log("error in creating a message");
        console.log(err);
        callback(false, null);
      } else {
        console.log('message successfully created');
        //return timestamp
        callback(true, message.time_created);
      }
    });
  }

}
