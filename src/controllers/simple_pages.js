module.exports = {
  loadHomePage: (req,res,next) => {
    try {
      const displayName = req.session.passport !== undefined ? req.session.passport.user["displayName"] : "";
      res.render('home',{ displayName });
    }
    catch(err) {
      next(err);
    }
  },
  loadAboutUs: (req,res,next) => {
    try {
      const displayName = req.session.passport !== undefined ? req.session.passport.user["displayName"] : "";
      res.render("about_us", { displayName });
    }
    catch(err) {
      next(err);
    }
  }
};