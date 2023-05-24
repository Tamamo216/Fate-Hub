const UserSQ = require("../../models/postgres/user_sq");
const dailySQGainHistories = require("../../models/postgres/daily_sq_gain");

//Each user can only collect daily saint quartz three times a day
async function checkDailySQLimit(userId) {
  //The beginning of a day is defined as 0h00 of the current day.
  //while the end of a day happens at 23h59m59s.
  const startTimestamp = new Date();
  const endTimestamp = new Date();
  startTimestamp.setHours(0,0,0);
  endTimestamp.setHours(23,59,59);
  try {
    const result = await dailySQGainHistories.dailySQreceivedTodayCount(userId,startTimestamp,endTimestamp);
    
    if (parseInt(result.count) === 3)
      return true;
    return false;
  }
  catch(err) {

  }

}

module.exports = {
  getDailySQ: async function(req,res,next) {
    if (req.cookies["daily-sq-cooldown"] !== undefined) {
      res.status(200).json({status: "cooldown", msg: "You have already received daily saint quartz three times today and need to wait until the next day"});
      return;
    }
    const onCooldow = await checkDailySQLimit(req.user.id);
    if (onCooldow) {
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate()+1);
      nextDay.setHours(0,0,0);
      res.cookie("daily-sq-cooldown", "true", {expires: nextDay});
      res.status(200).json({status: "cooldown", msg: "You have already received daily saint quartz three times today and need to wait until the next day"});
      return;
    }

    const random = Math.random();
    let result = -1;
    if (random < 0.4)
      result = 1;
    else if (random < 0.7)
      result = 2;
    else if (random < 0.9)
      result = 3;
    else result = 4;
    const sq_received = 30 * result;
    const info = {
      userId: req.user.id,
      quantity: sq_received,
      date_received: new Date()
    }
    await UserSQ.addUserSQ(sq_received);
    await dailySQGainHistories.insert(info);
    res.status(200).json({status: "success", msg: `You just got ${sq_received}`});
  }
}