//Model: message

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObejctId;

var messageSchema = new Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  time_created: { type: Date, default: Date.now, required:true }
});

module.exports = mongoose.model('Message', messageSchema);
