const User = require("../../models/postgres/user");
const bcrypt = require("bcrypt");

module.exports = {
  loadLoginPage: (req,res,next) => {
    try {
      if (req.session.passport)
        res.redirect("/");
      else {
        let errorMessage = "";
        if (req.session.messages)
          errorMessage = req.session.messages[req.session.messages.length-1];
        res.render("login", {errorMessage});
      }
    } 
    catch(err) {
      next(err);
    }
  }, 
  loadRegisterPage: (req,res,next) => {
    try {
      const displayName = req.user !== undefined ? req.user["display_name"] : "";
      res.render("register", {displayName});
    }
    catch (err) {
      next(err);
    }
  },
  register: async (req,res,next) => {
    const {username,password,email,displayName,gender,nationality} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    User.createUser({
      username,
      hashedPassword,
      email,
      displayName,
      gender,
      nationality
    })
      .then(() => {
        res.status(200).json({msg: "new account was successfully created"});
      })
      .catch(err => {
        const error = err.message;
        if (error.includes("username")) {
          res.status(409).json({msg: "the username has already existed, please pick another username"});
        }
        else if (error.includes("email")) {
          res.status(409).json({msg: "the email has already been used, please choose a different email"});
        }
        else
          next(err);
      });
  },
  loadProfilePage: (req,res,next) => {
    try {
      const user = req.user;
      const displayName = req.user["display_name"];
      res.render("user/profile", {user, displayName});
    }
    catch (err) {
      next(err);
    }
  },
  loadProfileEditPage: (req,res,next) => {
    const user = req.user;
    try {
      const days = Array.from({length: 31}, (_,i) => i+1);
      const months = Array.from({length: 12}, (_,i) => i+1);
      const startYear = 1985;
      const endYear = 2023;
      const years = Array.from({length: (endYear-startYear) + 1}, (_,i) => startYear+i);
      if (user.birthday !== null) {
        const [birthDay, birthMonth, birthYear] = user.birthday.split('/');
        user.birthDay = birthDay;
        user.birthMonth = birthMonth;
        user.birthYear = birthYear;
      }
      res.render("user/profile_edit", {user,days,months,years, displayName: user["display_name"]});
    }
    catch (err) {
      next(err);
    }
  }, 
  updateProfile: (req,res,next) => {
    const userId = req.user.id;
    let userInfo = req.body;
    userInfo.id = userId;
    User.updateUser(userInfo)
      .then(() => {
        res.status(302).json({msg: "profile was successfuly updated", redirect: "/user/profile"});
      })
      .catch((err) => next(err));
  },
  loadChangePasswordPage: (req,res,next) => {
    try {
      if (req.user.password !== null) {
        const displayName = req.user["display_name"];
        res.render("user/change_password", {displayName});
      }
      else {
        res.redirect("/user/profile");
      }
    }
    catch(err) {
      next(err);
    }
  },
  changePassword: (req,res,next) => {
    const {oldPassword, newPassword, newPasswordRetype} = req.body;
    const userId = req.user.id;
    User.findUserBy("id", userId)
      .then(async (user) => {
        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) {
          res.status(401).json({
            code: 0,
            msg: "the old password is not correct"
          });
          return;
        }
        if (newPassword !== newPasswordRetype) {
          res.status(400).json({
            code: 1,
            msg: "the new password and the retyped password do not match"
          });
          return;
        }
        const newHasedPassword = await bcrypt.hash(newPassword,10);
        User.changePassword(userId, newHasedPassword)
          .then(() => {
            res.status(300).json({
              code: 2,
              msg: "password has changed successfully"
            })
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
    
  },
  loadRemoveUserPage: (req,res,next) => {
    try {
      const displayName = req.user["display_name"];
      res.render("user/remove_user", {user: req.user, displayName});
    }
    catch(err) {
      next(err);
    }
  },
  
  removeUser: (req,res,next) => {
    const userId = req.user.id;
    User.removeUser(userId)
      .then(() => {
        req.logout((err) => {
          if (err) next(err);
        });
        res.clearCookie("connect.sid");
        res.status(302).json({msg: "Account was successfully removed", redirect: "/login"});
      })
      .catch((err) => next(err));
  }
};