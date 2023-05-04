const Servant = require("../../models/mongodb/servant");

function getServants(req,res,next) {
  const username = req.session.username;
  res.render("home", { username });
}

function add(req,res,next) {
  Servant.create({
    name : req.body.servant_name,
    class : req.body.servant_class,
    image : req.body.image_link
  }).
    then((servant) => console.log("successfully inserted new servant")).
    catch((error) => res.status(400).send(error));
}

function search(req,res,next) {
  switch (req.query.searchType) {
    case "name":
      Servant.find({name : {"$regex" : req.query.q, "$options" : "i"}}).lean()
        .then((servants) => res.render("favorite_servants", { servants }))
        .catch((error) => res.status(400).send(error));
      break;
    case "class":
      Servant.find({class : {"$regex" : req.query.q, "$options" : "i"}}).lean()
        .then((servants) => res.render("favorite_servants", { servants}))
        .catch((error) => res.status(400).send(error));
      break;
  }
}

function details(req,res,next) {
  const username = req.session.username;
  res.render("servant_details", { username });
}
module.exports = { getServants, add, search, details };