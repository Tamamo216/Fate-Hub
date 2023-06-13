const db = require("../../database/postgreSQL");

module.exports = {
  insert: function(userId, servantId) {
    return db.none("INSERT INTO wishlists(user_id, servant_id) VALUES($1,$2)",
    [userId, servantId]);
  },
  getList: function(userId) {
    return db.manyOrNone("SELECT wl.servant_id, wl.added_date, rh.total_cost, s.name, s.avatar \
    FROM wishlists wl LEFT JOIN rolling_histories rh ON wl.rolling_id = rh.id \
    JOIN servants s ON wl.servant_id = s.id WHERE wl.user_id = $1", userId);
  },
  remove: function(userId, servantId) {
    return db.none("DELETE FROM wishlists WHERE user_id = $1 AND servant_id = $2", [userId, servantId]);
  }
}