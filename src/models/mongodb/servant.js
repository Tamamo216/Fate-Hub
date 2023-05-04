const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const servantSchema = new Schema({
  name : {type : String, default : "Unknow"},
  class : {type : String, default : "Unknow"},
  image : {type : String, default : "No image"}
});

module.exports = mongoose.model("Servant", servantSchema);