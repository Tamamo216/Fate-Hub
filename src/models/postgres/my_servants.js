const db = require("../../database/postgreSQL");

module.exports = {
  insertNewServant: async (userId, servantId, servantInfo) => {
    try {
      const query = "INSERT INTO my_servants (user_id,servant_id,servant_level,np_level,atk,hp,fou_atk,fou_hp,personal_nickname, bond_lv, skill1_lv, skill2_lv, skill3_lv) VALUES (${userId},${servantId},${servantInfo.servantLevel},${servantInfo.npLevel},${servantInfo.atk},${servantInfo.hp},${servantInfo.fouATK},${servantInfo.fouHP},${servantInfo.personalNickname},${servantInfo.bondLevel},${servantInfo.skill1},${servantInfo.skill2},${servantInfo.skill3})";
      return db.none(query, { userId, servantId, servantInfo });
    }
    catch (err) {
      console.log(err);
    } 
  },
  findServant: function(servantId, userId) {
    return db.oneOrNone("SELECT * FROM my_servants WHERE servant_id = ${servantId} AND user_id = ${userId}", {servantId, userId});
  },
  getUnsummonedServants: async (userId, search, filter) => {
    search = `%${search}%`;
    const npCard = `%${filter.npCard}%`;
    const servantClass = `%${filter.servantClass}%`;
    const query = "SELECT id, name, avatar, class, np_card\
                   FROM servants s\
                   WHERE NOT EXISTS (\
                    SELECT 1 FROM my_servants ms\
                    WHERE ms.servant_id = s.id\
                    AND ms.user_id = ${userId}) AND s.name ILIKE ${search}\
                    AND s.np_card ILIKE ${npCard} AND s.class ILIKE ${servantClass}";
    return db.manyOrNone(query, {userId, search, npCard, servantClass});
  },

  getSummonedServants: async (userId, search, filter) => {
    search = `%${search}%`;
    const npCard = `%${filter.npCard}%`;
    const servantClass = `%${filter.servantClass}%`;
    const query = "SELECT s.id, s.name, s.avatar, s.class, s.np_card,\
                   ms.servant_level, ms.np_level,ms.atk, ms.hp, ms.fou_atk,\
                   ms.fou_hp, ms.bond_lv, ms.favorite\
                   FROM servants s JOIN my_servants ms\
                   ON s.id = ms.servant_id\
                   WHERE ms.user_id = ${userId} AND s.name ILIKE ${search}\
                   AND s.np_card ILIKE ${npCard} AND s.class ILIKE ${servantClass}";
    return db.manyOrNone(query, {userId, search, npCard, servantClass});
  },

  updateFavoriteServants: (servantsId, userId) => {
    const query = "UPDATE my_servants SET favorite = true\
                   WHERE my_servants.servant_id = ANY(${servantsId})\
                   AND my_servants.user_id = ${userId}";
    return db.none(query, {servantsId, userId});
  },

  removeFavoriteServants: (servantsId, userId) => {
    const query = "UPDATE my_servants SET favorite = false\
                   WHERE my_servants.servant_id = ANY(${servantsId})";
    return db.none(query, {servantsId, userId});
  },

  removeServants: (servantsId, userId) => {
    const query = "DELETE FROM my_servants\
                   WHERE my_servants.servant_id = ANY(${servantsId})\
                   AND my_servants.user_id = ${userId}";
    return db.none(query, {servantsId, userId});
  },

  getServantDetails: (servantId, userId) => {
    const query = "SELECT s.name, s.avatar, s.img_details, s.details_url, s.atk, s.hp, ms.*\
                   FROM servants s JOIN my_servants ms ON s.id = ms.servant_id\
                   WHERE ms.user_id = ${userId} AND ms.servant_id = ${servantId}";
    return db.one(query, {servantId, userId});
  },

  updateServantDetails: (servantId, userId, myServant) => {
    const query = "UPDATE my_servants\
                   SET servant_level = ${myServant.servantLevel},\
                   np_level = ${myServant.npLevel},\
                   atk = ${myServant.atk},\
                   hp = ${myServant.hp},\
                   fou_atk = ${myServant.fouATK},\
                   fou_hp = ${myServant.fouHP},\
                   skill1_lv = ${myServant.skill1},\
                   skill2_lv = ${myServant.skill2},\
                   skill3_lv = ${myServant.skill3},\
                   bond_lv = ${myServant.bondLevel},\
                   personal_nickname = ${myServant.personalNickname}\
                   WHERE servant_id = ${servantId} AND user_id = ${userId}";
    return db.none(query, {servantId, userId, myServant});
  }
}