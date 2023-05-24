const db = require("../../database/postgreSQL");

module.exports = {
  dailySQreceivedTodayCount: function(userId, startTimestamp, endTimestamp) {
    return db.one("SELECT COUNT(id) FROM daily_sq_gain_histories \
          WHERE user_id = ${userId} AND date_received BETWEEN ${startTimestamp} AND ${endTimestamp}", {userId, startTimestamp, endTimestamp});
  },
  insert: function(info) {
    return db.none("INSERT INTO daily_sq_gain_histories(user_id, quantity, date_received) \
            VALUES (${info.userId},${info.quantity},${info.date_received})", {info});
  }
}