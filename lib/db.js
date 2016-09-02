var mongoose = require('mongoose');
var config = require('../config.js');

module.exports = function(){

  //initiate a mongoose connection to MongoDB
  this.init = function(callback){
    mongoose.connect(config.db.host, function(err){
      if (err){
        console.log("Error connecting:" + err.stack);
        callback(false);
      }
    });
    mongoose.connection.once('open', function(){
      callback(mongoose.connection);
    });
  }

  //close the mongoose connection to MongoDB
  this.close = function(connection){
    connection.close();
  }

}
