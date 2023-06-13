const db = require("../../database/postgreSQL");

module.exports = {
  getUserSQ: function(userId) {
    return db.one("SELECT * FROM user_saint_quartz_details WHERE user_id = $1", userId);
  },
  addUserSQ: function(info) {
    return db.none("UPDATE user_saint_quartz_details SET current_sq = current_sq + ${quantity} WHERE user_id = ${userId}", info);
  }
}