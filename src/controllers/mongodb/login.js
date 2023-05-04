const bcrypt = require("bcrypt");
const User = require("../../models/mongodb/user");

function loadPage(req,res,next) {
  res.render("login");
}

function loginValidate(req,res,next) {
  const {username, password} = req.body;
  User.findOne({ username })
    .then(async (user) => {
      const passwordValid = await bcrypt.compare(password,user.password);
      if (passwordValid) {
        req.session.username = username;
        req.session.password = user.password;
        res.status(200).redirect("/servant");
      }
      else {
        req.status(200).json({"msg" : "incorrect password"});
      }
    })
    .catch(err => console.log(err.message));
}

module.exports = { loadPage, loginValidate};