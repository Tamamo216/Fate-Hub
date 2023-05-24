const db = require("../../database/postgreSQL");

module.exports = {
  findRollingHistory: function(userId, servantId) {
    return db.oneOrNone("SELECT * FROM rolling_histories WHERE user_id = $1 AND servant_id = $2", [userId, servantId]);
  }
}