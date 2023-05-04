const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username : {type: String, required: true, unique: true},
  password : {type: String, required: true},
  email : {type: String, required: true, unique: true},
  gender: {type: String, default: ""},
  national: {type: String, default: ""}
});

module.exports = mongoose.model("User", userSchema);