const Transactions = require("../../models/postgres/transactions");
const RollingHistories = require("../../models/postgres/rolling_histories");
const Servants = require("../../models/postgres/servant");
const MyServants = require("../../models/postgres/my_servants");

async function checkIfServantIsOwned(userId, servantId) {
  try {
    const servant = await MyServants.findServant(servantId, userId);
    if (servant === null)
      return false;
    return true;
  }
  catch(err) {
    console.log(err);
  }
}
module.exports = {
  loadHomePage: function(req,res,next) {
    try {
      res.render("purchase/homepage");
    }
    catch(err) {
      next(err);
    }
  },
  loadPurchasePage: function(req,res,next) {
    try {
      res.render("purchase/details");
    }
    catch(err) {
      next(err);
    }
  },
  rollingServant: async function(req,res,next) {
    const userId = req.user.id;
    const servantId = req.params.servantid;
    const ownedServantCheck = await checkIfServantIsOwned(userId, servantId);
    if (ownedServantCheck) {
      res.status(400).json({msg: "You have already owned this servant"});
      return;
    }
    //rolling result is 0 which means that user failed to get the servant, otherwise it is 1 if user succeeded.
    let rollingResult = 0;
    //Probability to be albe to accquire a servant in a single roll
    const prob = 0.45;
    const random = Math.random();
    rollingResult = random < prob ? 1 : 0;
    try {
      let rollingHistory = await RollingHistories.findRollingHistory(userId, servantId);
      const servant = await Servants.getById(servantId, ["id", "name", "class", "atk", "hp"]);
      servant.minATK = parseInt(servant.atk.split('/')[0].replace(',',''));
      servant.minHP = parseInt(servant.hp.split('/')[0].replace(',',''));
      if (rollingHistory === null) {
        rollingHistory = {
          roll_times: 1,
          total_cost: 30,
          first_roll_date: new Date(),
          last_roll_date: new Date(),
          status: rollingResult === 1 ? "success" : "fail"
        }
      }
      else {
        rollingHistory.roll_times += 1;
        rollingHistory.total_cost += 30;
        rollingHistory.last_roll_date = new Date(),
        rollingHistory.status = rollingResult === 1 ? "success" : "fail"
      }
      await Transactions.rollingServant(userId, servantId, rollingHistory, servant);
      // if (rollingResult === 1) {
      //   const servant = await Servant.getById(servantId, ["id", "name", "atk", "hp"]);
      //   servant.minATK = parseInt(servant.atk.split('/')[0].replace(',',''));
      //   servant.minHP = parseInt(servant.hp.split('/')[0].replace(',',''));
      //   await Transactions.addingNewPurchasedServant(userId, servantId, servant);
      // }
      if (rollingResult === 1)
        res.json({status: "success", msg: `Congrats! You just got ${servant.name} +(${servant.class})`});
      else
        res.json({status: "fail", msg: "Good luck next time"});
    }
    catch(err) {
      if (err.message.includes("check_negative_current_sq"))
        res.status(400).json({msg: "You do not have enough saint quartz to roll"});
      else if (err.message.includes("my_servants_pk"))
        res.status(400).json({msg: "You have already owned this servant"});
      else
        next(err);
    }
  }
}