const simpleRoute = require("./simple_pages");
const servantRoute = require("./servant");
const loginRoute = require("./login");
const registerRoute = require("./register");
const userRoute = require("./user");
const myServantRoute = require("./my_servants");
const logoutRoute = require("./logout");
const insertServantsRoute = require("./insert_servants_to_DB");
const humanVerifyRoute = require("./human_verify");

function isAuthenticated(req,res,next) {
  if (req.session.passport) {
    if (!req.user) {
      const User = require("../models/postgres/user");
      User.findUserBy("id", req.session.passport.user)
        .then((user) => {
          req.user = user;
        })
        .catch((err) => {
          next(err);
        })
    }
    next();
  }
  else {
    res.redirect("/login");
  }
}

route = (app) => {
  app.use("/human-verify", humanVerifyRoute);
  app.use((req,res,next) => {
    if (req.cookies["human-verify"] === undefined)
      res.redirect("/human-verify");
    else
      next();
  });
  app.use("/login", loginRoute);
  app.use("/register", registerRoute);
  app.use("/insert-servants", insertServantsRoute);
  app.use("/servants", isAuthenticated, servantRoute);
  app.use("/user/my-servants", isAuthenticated, myServantRoute);
  app.use("/user", isAuthenticated, userRoute);
  app.use("/logout", logoutRoute);
  app.use("/", simpleRoute);
};
module.exports = route;