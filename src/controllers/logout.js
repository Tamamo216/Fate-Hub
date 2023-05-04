function logout(req,res,next) {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    else {
      res.redirect("/login");
    }
  });
}

module.exports = { logout };