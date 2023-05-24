const db = require("../../database/postgreSQL");

module.exports = {
  rollingServant: (userId, servantId, rollingInfo, servantInfo) => {
    return db.tx(async t => {
      await t.none("UPDATE user_saint_quartz_details \
                  SET current_sq = current_sq - 30, sq_have_used = sq_have_used + 30, \
                  most_sq_per_ser = CASE WHEN most_sq_per_ser < ${rollingInfo.total_cost} \
                  THEN ${rollingInfo.total_cost} ELSE most_sq_per_ser END \
                  WHERE user_id = ${userId}", {userId, rollingInfo});
      await t.none("INSERT INTO rolling_histories(user_id, servant_id, roll_times, \
                  total_cost, first_roll_date, last_roll_date, status) VALUES\
                  (${userId}, ${servantId}, 1, 30, ${rollingInfo.first_roll_date}, \
                  ${rollingInfo.last_roll_date}, ${rollingInfo.status}) \
                  ON CONFLICT ON CONSTRAINT rolling_hist_pk DO UPDATE \
                  SET roll_times = rolling_histories.roll_times + 1, total_cost = rolling_histories.total_cost + 30, \
                  last_roll_date = ${rollingInfo.last_roll_date}, status = ${rollingInfo.status}", {userId, servantId, rollingInfo});
      if (rollingInfo.status === 'success') {
        await t.none("INSERT INTO my_servants(user_id,servant_id,atk,\
                    hp) VALUES(${userId},${servantId},${servantInfo.minATK},${servantInfo.minHP})", {userId, servantId, servantInfo});
        await t.none("UPDATE users SET number_of_servants = number_of_servants + 1\
                    WHERE id = $1", userId);
        await t.none("UPDATE user_saint_quartz_details \
                    SET avg_sq_per_ser = sq_have_used/u.number_of_servants \
                    FROM users u \
                    WHERE user_id = u.id AND u.id = $1", userId);
      }
    });
  },
  addingNewPurchasedServant: (userId, servantId, servantInfo) => {
    return db.tx(async t => {
      await t.none("INSERT INTO my_servants(user_id,servant_id,atk,\
                  hp) VALUES(${userId},${servantId},${servantInfo.minATK},${servantInfo.minHP})", {userId, servantId, servantInfo});
      await t.none("UPDATE users SET number_of_servants = number_of_servant + 1\
                  WHERE id = $1", userId);
    });
  }
}