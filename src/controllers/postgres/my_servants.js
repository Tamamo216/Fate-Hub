const Servant = require("../../models/postgres/servant");
const MyServants = require("../../models/postgres/my_servants");
const utils = require("../../utils/utils");
module.exports = {
  loadHomePage : (req,res,next) => {
    const userId = req.user.id;
    const displayName = req.user["display_name"];
    let search = "";
    let order = "class";
    const filter = {
      field: "class",
      value: ""
    }
    if (Object.keys(req.query).length > 0) {
      if (req.query.hasOwnProperty("search"))
        search = req.query.search;
      if (req.query.hasOwnProperty("order"))
        order = req.query.order;
      if (req.query.hasOwnProperty("filterField")) {
        filter.field = req.query.filterField;
        if (filter.field === "np")
          filter.field += "_card";
        filter.value =req.query.filterValue;
      }
    }
   MyServants.getSummonedServants(userId, search, filter)
    .then((servants) => {
      utils.sortServantsByField(servants, order);
      if (order !== "name") {
        servants.forEach((servant) => {
          servant.sortInfo = {
            name: utils.nameMapping(order),
            value: servant[order]
          }
        });
      }
      res.render("my_servants/homepage", {servants, order, filterValue: filter.value, displayName});
    })
    .catch((err) => next(err));
  },

  loadAddServantFirstPage : (req,res,next) => {
    const userId = req.user.id;
    const displayName = req.user["display_name"];
    let search = "";
    let order = "class";
    const filter = {
      field: "class",
      value: ""
    }
    if (Object.keys(req.query).length > 0) {
      if(req.query.hasOwnProperty("search"))
        search = req.query.search;
      if (req.query.hasOwnProperty("order"))
        order = req.query.order;
      if (req.query.hasOwnProperty("filterField")) {
        filter.field = req.query.filterField;
        if (filter.field === "np")
          filter.field += "_card";
        filter.value = req.query.filterValue;
      }
    }
    MyServants.getUnsummonedServants(userId, search, filter)
      .then((servants) => {
        utils.sortServantsByField(servants, order);
        if (order !== "name") {
          servants.forEach((servant) => {
            servant.sortInfo = {
              name: utils.nameMapping(order),
              value: servant[order]
            }
          });
        }
        res.render("my_servants/add_servant", {servants, order, filterValue: filter.value, displayName});
      })
      .catch((err) => next(err));
  },

  loadAddServantSecondPage: (req,res,next) => {
    const servantId = req.params.servantid;
    const displayName = req.user["display_name"];
    Servant.getById(servantId, ["id", "name", "avatar", "atk", "hp"])
      .then((servant) => {
        servant.minATK = parseInt(servant.atk.split('/')[0].replace(',', ''));
        servant.minHP = parseInt(servant.hp.split('/')[0].replace(',',''));
        res.render("my_servants/add_servant_form", {servant, displayName});
      })
      .catch((err) => next(err));
  },

  loadRemoveServantPage: (req,res,next) => {
    const userId = req.user.id;
    const displayName = req.user["display_name"];
    let search = "";
    let order = "class";
    const filter = {
      field: "class",
      value: ""
    }
    if (Object.keys(req.query).length > 0) {
      if (req.query.hasOwnProperty("search"))
        search = req.query.search;
      if (req.query.hasOwnProperty("order"))
        order = req.query.order;
      if (req.query.hasOwnProperty("filterField")) {
        filter.field = req.query.filterField;
        if (filter.field === "np")
          filter.field += "_card";
        filter.value = req.query.filterValue;
      }
    }
    MyServants.getSummonedServants(userId, search, filter)
      .then((servants) => {
        utils.sortServantsByField(servants, order);
        if (order !== "name") {
          servants.forEach((servant) => {
            servant.sortInfo = {
              name: utils.nameMapping(order),
              value: servant[order]
            }
          });
        }
        res.render("my_servants/delete_servant", {servants, order, filterValue: filter.value, displayName});
      })
      .catch((err) => next(err));
  },

  addServant: (req,res,next) => {
    const servantId = req.params.servantid;
    const userId = req.user.id;
    const servantInfo = req.body;
    MyServants.insertNewServant(userId, servantId,servantInfo)
      .then(() => {
        res.redirect("/user/my-servants");
      })
      .catch((err) => next(err));
  },

  markAsFavorite: (req,res,next) => {
    const newFavoriteServantsId = req.body.servantsId;
    const userId = req.user.id;
    MyServants.updateFavoriteServants(newFavoriteServantsId, userId)
      .then(() => {
        res.status(302).json({msg: "successfully updated"});
      })
      .catch((err) => next(err));
  },

  removeFavorite: (req,res,next) => {
    const removingFavoriteServantsId = req.body.servantsId;
    const userId = req.user.id;
    MyServants.removeFavoriteServants(removingFavoriteServantsId, userId)
      .then(() => {
        res.status(302).json({msg: "successfully removed"});
      })
      .catch((err) => next(err));
  },

  removeServants: (req,res,next) => {
    const servantsId = req.body.servantsId;
    const userId = req.user.id;
    MyServants.removeServants(servantsId, userId)
      .then(() => {
        res.status(302).json({redirect: "/user/my-servants"});
      })
      .catch((err) => next(err));
  },

  loadDetailsPage: (req,res,next) => {
    const servantId = req.params.servantid;
    const displayName = req.user["display_name"];
    const userId = req.user.id;
    MyServants.getServantDetails(servantId, userId)
      .then((myServant) => {
        myServant.img_details = "/img/" + myServant.img_details;
        const levelingCost = utils.levelingCostCacl(myServant);
        const qpCost = utils.skillsQPCostCacl(myServant.skill1_lv, myServant.skill2_lv, myServant.skill3_lv);
        levelingCost.forEach((e) => {
          e.requiredQP = utils.separateByThousand(e.requiredQP);
        });
        qpCost.skill1 = utils.separateByThousand(qpCost.skill1);
        qpCost.skill2 = utils.separateByThousand(qpCost.skill2);
        qpCost.skill3 = utils.separateByThousand(qpCost.skill3);
        qpCost.total = utils.separateByThousand(qpCost.total);
        res.render("my_servants/details", {myServant, levelingCost, qpCost, displayName});
      })
      .catch((err) => next(err));
  },

  updatetDetails: (req,res,next) => {
    const servantId = req.params.servantid;
    const userId = req.user.id;
    const myServant = req.body;
    MyServants.updateServantDetails(servantId, userId, myServant)
      .then(() => {
        res.status(200).json({msg: "successfully updated"});
      })
      .catch((err) => next(err));
  }
};