var mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({
 userName: { type: String },
 pieName:{ type: String },
 fileName:{ type: String },
 file:  {  type:String}
  
  });
module.exports = mongoose.model('File', FileSchema);