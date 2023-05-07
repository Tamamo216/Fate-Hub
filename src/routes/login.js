const express = require("express");
const passport = require("passport");
const router = express.Router();
//MongoDB controller
// const loginController = require("../controllers/mongodb/login");
//PostgreSQL controller
const userController = require("../controllers/postgres/user");

router.get("/", userController.loadLoginPage);
router.post("/", passport.authenticate("local", {
  failureRedirect: "/login",
  failureMessage: true
}), (req,res,next) => {
  try {
    if (req.body.remember == 'yes') {
      req.session.cookie.maxAge = 3*24*60*60*1000;
    }
    res.redirect("/servants");
  } catch(err) {
    next(err);
  }
});
router.get("/oauth2/google", passport.authenticate("google"));
router.get("/oauth2/google/callback", passport.authenticate("google", {
  failureRedirect: "/login",
  failureMessage: true
}), (req,res,next) => {
  res.redirect("/servants");
});
router.get("/oauth2/microsoft", passport.authenticate("microsoft",{prompt: "select_account"}));
router.get("/oauth2/microsoft/callback", passport.authenticate("microsoft", {
  failureRedirect: "/login",
  failureMessage: true
}), (req,res) => {
  res.redirect("/servants");
});
module.exports = router;