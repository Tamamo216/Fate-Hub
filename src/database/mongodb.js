const mongoose = require("mongoose");

const mongoURI = "mongodb://127.0.0.1:27017/MyDatabase";
function connect() {
  mongoose.connect(mongoURI).
    then(() => {console.log("sucessfully connected")}).
    catch((error) => {console.log(error)});
}

module.exports = {connect, mongoURI};