var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var imageSchema = new Schema({
  name:        String,
  oldName:     String,
  size:        String,    
  type:        String,
  deleteType:  String,
  url : String,
  deleteUrl: String
});
module.exports = mongoose.model('image', imageSchema);