const bcrypt = require("bcrypt");
const User = require("../../models/mongodb/user");

function loadPage(req,res,next) {
  res.render("register");
}

function register(req,res,next) {
  const {username,password,email,gender,nationality} = req.body;
  User.create({
    username,
    password,
    email,
    gener,
    national: nationality
  }).then(() => console.log("User registered successfully"))
    .catch((err) => console.log(err.message));
}