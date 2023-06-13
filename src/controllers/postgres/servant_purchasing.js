const Transactions = require("../../models/postgres/transactions");
const RollingHistories = require("../../models/postgres/rolling_histories");
const Servants = require("../../models/postgres/servant");
const MyServants = require("../../models/postgres/my_servants");
const UserSQ = require("../../models/postgres/user_sq");
const WishLists = require("../../models/postgres/wishlists");
const utils = require("../../utils/utils");
async function checkIfServantIsRollable(userId, servantId) {
  try {
    const servant = await MyServants.findServant(servantId, userId);
    if (servant !== null && servant.np_level === 5)
      return false;
    return true;
  }
  catch(err) {
    console.log(err);
  }
}

module.exports = {
  loadHomePage: async function(req,res,next) {
    try {
      const displayName = req.user["display_name"];
      const userId = req.user.id;
      const q = (req.query.hasOwnProperty("q")) ? req.query.q : "";
      const filter = {
        npCard: (req.query.hasOwnProperty("np")) ? req.query.np : "",
        servantClass: ""
      };
      const order = (req.query.hasOwnProperty("order")) ? req.query.order : "id";
      let onCooldow = false;
      if (q !== "") {
        const [servants, sqInfo, wishlist, unfinishedPurchases] = await Promise.all([
          MyServants.getUnsummonedServants(userId, q, filter),
          UserSQ.getUserSQ(userId),
          WishLists.getList(userId),
          RollingHistories.getUnfinishedPurchases(userId)
        ]);
        onCooldown = (req.cookies['daily-sq-cooldown'] !== undefined) ? true : false;
        servants.forEach(ser => {
          ser.minATK = parseInt(ser.atk.split('/')[0].replace(',',''));
          ser.minHP = parseInt(ser.hp.split('/')[0].replace(',',''));
        });
        utils.sortServantsByField(servants, order);
        wishlist.forEach(e => {
          e["added_date"] = e["added_date"].toLocaleString();
          e["total_cost"] = (e["total_cost"] === null) ? 0 : e["total_cost"];
        })
        unfinishedPurchases.forEach(e => {
          e["first_roll_date"] = e["first_roll_date"].toLocaleString();
          e["last_roll_date"] = e["last_roll_date"].toLocaleString();
        });
        res.render("purchase/homepage", {
          servants, sqInfo, wishlist, unfinishedPurchases, onCooldown, query: true, displayName
        });
      }
      else {
        let servantsByClass = [];
        let classList = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin", "Berserker", "Ruler", "Avenger", "Moon Cancer", "Foreigner", "Alter Ego", "Pretender"];
        for (let i = 0; i < classList.length; ++i) {
          const servantsList = {className: "", servants: []};
          servantsList.className = classList[i];
          filter.servantClass = classList[i];
          const servants = await MyServants.getRollableServants(userId, q, filter);
          servants.forEach(ser => {
            ser.minATK = parseInt(ser.atk.split('/')[0].replace(',',''));
            ser.minHP = parseInt(ser.hp.split('/')[0].replace(',',''));
          });
          servantsList.servants = servants;
          servantsByClass.push(servantsList);
        }
        for (let i = 0; i < servantsByClass.length; ++i) {
          utils.sortServantsByField(servantsByClass[i].servants, order);
        }
        onCooldown = (req.cookies['daily-sq-cooldown'] !== undefined) ? true : false;
        const [sqInfo, wishlist, unfinishedPurchases] = await Promise.all([
          UserSQ.getUserSQ(userId),
          WishLists.getList(userId),
          RollingHistories.getUnfinishedPurchases(userId)
        ]);
        wishlist.forEach(e => {
          e["added_date"] = e["added_date"].toLocaleString();
          e["total_cost"] = (e["total_cost"] === null) ? 0 : e["total_cost"];
        })
        unfinishedPurchases.forEach(e => {
          e["first_roll_date"] = e["first_roll_date"].toLocaleString();
          e["last_roll_date"] = e["last_roll_date"].toLocaleString();
        });
        res.render("purchase/homepage", {
          servantsByClass, sqInfo, onCooldown, wishlist, unfinishedPurchases, displayName
        });
      }
    }
    catch(err) {
      next(err);
    }
  },
  loadPurchasePage: async function(req,res,next) {
    try {
      const userId = req.user.id;
      const displayName = req.user["display_name"];
      const servantId = req.params.servantid;
      const servant = await Servants.getById(servantId, ['id', 'name', 'avatar', 'atk', 'hp', 'np_card', 'details_url']);
      servant.minATK = parseInt(servant.atk.split('/')[0].replace(',',''));
      servant.minHP = parseInt(servant.hp.split('/')[0].replace(',',''));
      const sqInfo = await UserSQ.getUserSQ(userId);
      let rollingInfo = await RollingHistories.findRollingHistory(userId, servantId);
      if (rollingInfo === null)
        rollingInfo = {"total_cost": 0, "roll_times": 0};
      res.render("purchase/details", {servant, sqInfo, rollingInfo, displayName});
    }
    catch(err) {
      next(err);
    }
  },
  rollingServant: async function(req,res,next) {
    const userId = req.user.id;
    const servantId = req.params.servantid;
    const rollableServantCheck = await checkIfServantIsRollable(userId, servantId);
    if (!rollableServantCheck) {
      res.status(400).json({msg: "You have reached maximum NP level for this servant"});
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
          latest_roll_status: rollingResult === 1 ? "successful" : "failed"
        }
      }
      else {
        rollingHistory.roll_times += 1;
        rollingHistory.total_cost += 30;
        rollingHistory.last_roll_date = new Date(),
        rollingHistory.latest_roll_status = rollingResult === 1 ? "successful" : "failed"
      }
      const myServant = await Transactions.rollingServant(userId, servantId, rollingHistory, servant);
      if (rollingResult === 1)
        res.json({status: "success", msg: `Congrats! You just got NP${myServant.np_level} ${servant.name} (${servant.class})`});
      else
        res.json({status: "fail", msg: "Good luck next time"});
    }
    catch(err) {
      if (err.message.includes("check_negative_current_sq"))
        res.status(400).json({msg: "You do not have enough saint quartz to roll"});
      else if (err.message.includes("my_servants_np_level_check"))
        res.status(400).json({msg: "You have reached maximum NP level for this servant"});
      else
        next(err);
    }
  }
}