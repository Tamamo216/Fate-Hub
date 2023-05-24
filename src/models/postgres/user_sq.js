const db = require("../../database/postgreSQL");

module.exports = {
  getUserSQ: function(userId) {
    return db.one("SELECT * FROM user_saint_quartz_details WHERE user_id = $1", userId);
  },
  addUserSQ: function(userId, sq) {
    return db.none("UPDATE user_saint_quartz_details SET current_sq = current_sq + $1 WHERE user_id = $2", [sq, userId]);
  }
}