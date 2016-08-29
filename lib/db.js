var mongoose = require('mongoose');
var config = require('../config.js');

module.exports = function(){

  //initiate a mongoose connection to MongoDB
  this.init = function(callback){
    mongoose.connect(config.db.host, function(err){
      if (err){
        console.log("Error connecting:" + err.stack);
        callback(false);
      } else {
        console.log('db connection open');
      }
    });
    mongoose.connection.once('open', function(){
      console.log('success yay');
      callback(mongoose.connection);
    });
  }

  //close the mongoose connection to MongoDB
  this.close = function(connection){
    connection.close();
    console.log('db connection closed');
  }

}
