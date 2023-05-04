const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const googleStrategy = require("passport-google-oauth20").Strategy;
const microsoftStrategy = require("passport-microsoft").Strategy;
const User = require("../models/postgres/user");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config({path: path.resolve(process.cwd(), "src/.env")});
const hostDomain = (process.argv[2] === "production") ? `https://${process.env.HOST_DOMAIN}` : "http://localhost";

function localVerify(username, password, done) {
  User.findUserBy("username", username)
    .then( async (user) => {
      const isValid = await bcrypt.compare(password,user.password);
      if (!isValid) {
        done(null, false, {message: "The password is incorrect"});
      }
      else
        done(null, user);
    })
    .catch((err) => {
      done(null, false, {message: "The username does not exist"});
    })
}

function googleVerify(accessToken, refreshToken, profile, done) {
  User.findUserByExternalAccountId(profile.id, "google")
    .then(async (user) => {
      if (!user) {
        try {
          const userId = await User.createUserWithExternalAccount(profile);
          const user = await User.findUserBy("id", userId);
          return done(null, user);
        }
        catch (err) {
          console.log(err);
          return done(null, false, {message: "Something went wrong. Cannot sign in your google account."});
        }
      }
      return done(null, user);
    })
    .catch(async (err) => {
      return done(err);
    });
}
function microsoftVerify(accessToken, refreshToken, profile, done) {
  User.findUserByExternalAccountId(profile.id, "microsoft")
    .then( async (user) => {
      if (!user) {
        try {
          const userId = await User.createUserWithExternalAccount(profile);
          const user = await User.findUserBy("id", userId);
          return done(null,user);
        }
        catch (err) {
          console.log(err);
          return done(null, false, {msg: "Something went wrong. Cannot sign in your Microsoft account"});
        }
      }
      return done(null,user);
    })
    .catch(async (err) => {
      return done(err);
    });
}
passport.use(new localStrategy(localVerify));
passport.use(new googleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${hostDomain}/login/oauth2/google/callback`,
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/user.phonenumbers.read",
    "https://www.googleapis.com/auth/user.birthday.read",
    "https://www.googleapis.com/auth/user.gender.read",
    "openid"
  ],
  state: true
}, googleVerify));
passport.use(new microsoftStrategy({
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  callbackURL: `${hostDomain}/login/oauth2/microsoft/callback`,
  scope: ["user.read"]
}, microsoftVerify));

passport.serializeUser((user, done) => {
  done(null, {id: user.id, displayName: user["display_name"]});
});
passport.deserializeUser((user, done) => {
  User.findUserBy("id", user.id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});