const db = require("../../database/postgreSQL");

module.exports = {
  findRollingHistory: function(userId, servantId) {
    return db.oneOrNone("SELECT * FROM rolling_histories WHERE user_id = $1 AND servant_id = $2", [userId, servantId]);
  },
  getTotalRecord: function(userId) {
    return db.one("SELECT COUNT(*) FROM rolling_histories WHERE user_id = $1", userId);
  },
  getRollingHistories: function(userId, page) {
    const rowsPerpage = 5;
    const offset = (page-1) * rowsPerpage;
    return db.manyOrNone("SELECT s.id, s.name, s.avatar, rh.total_cost, rh.roll_times, rh.first_roll_date, rh.last_roll_date, rh.latest_roll_status, ms.np_level \
    FROM rolling_histories rh JOIN servants s On rh.servant_id = s.id \
    LEFT JOIN my_servants ms ON rh.servant_id = ms.servant_id AND rh.user_id = ms.user_id \
    WHERE rh.user_id = $1 ORDER BY rh.last_roll_date DESC \
    LIMIT $2 OFFSET $3", [userId, rowsPerpage, offset]);
  },
  getUnfinishedPurchases: function(userId) {
    return db.manyOrNone("SELECT s.id, s.name, s.avatar, rh.roll_times, rh.total_cost, rh.first_roll_date, rh.last_roll_date, rh.latest_roll_status \
    FROM rolling_histories rh JOIN servants s ON rh.servant_id = s.id \
    WHERE rh.user_id = $1 AND rh.latest_roll_status = $2 ORDER BY rh.last_roll_date DESC", [userId, "failed"]);
  }
}