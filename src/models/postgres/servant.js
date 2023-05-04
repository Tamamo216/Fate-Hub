const pgp = require("pg-promise")();
const db = require("../../database/postgreSQL");

async function multipleInsert(servants) {
  for (const servant of servants) {
    skills = servant.skills;
    const skillInsertQuery = "INSERT INTO skills (img, name, rank, description)\
                              VALUES (${skill.skill_img},${skill.skill_name},${skill.skill_rank},${skill.skill_description})\
                              ON CONFLICT (name,rank) DO NOTHING RETURNING id";
    let skill1 = await db.oneOrNone(skillInsertQuery,{skill: skills[0]});
    let skill2 = await db.oneOrNone(skillInsertQuery, {skill: skills[1]});
    let skill3 = await db.oneOrNone(skillInsertQuery, {skill: skills[2]});
    if (skill1 === null) {
      skill1 = await db.one("SELECT id FROM skills WHERE skills.name = $1 AND skills.rank = $2", [skills[0].skill_name, skills[0].skill_rank]);
    }
    if (skill2 === null) {
      skill2 = await db.one("SELECT id FROM skills WHERE skills.name = $1 AND skills.rank = $2", [skills[1].skill_name, skills[1].skill_rank]);
    }
    if (skill3 === null) {
      skill3 = await db.one("SELECT id FROM skills WHERE skills.name = $1 AND skills.rank = $2", [skills[2].skill_name, skills[2].skill_rank]);
    }
    try {
      // skills_id = await db.many(query);
      console.log(`${servant.servant_id}\n`);
      const servantsInsertQuery = "INSERT INTO servants VALUES\
      (${servant.servant_id}, ${servant.name}, ${servant.servant_class}, ${servant.avatar}, ${servant.img_class},\
       ${servant.img_details_path}, ${servant.img_card_deck_path}, ${servant.rarity}, ${servant.jp_name}, ${servant.atk},\
       ${servant.hp}, ${servant.seiyuu}, ${servant.illustrator}, ${servant.attribute},\
       ${servant.gender}, ${servant.star_absorption},${servant.star_generation},\
       ${servant.np_charge_atk},${servant.np_charge_def}, ${servant.death_rate}, ${servant.alignments},\
       ${skill1.id}, ${skill2.id}, ${skill3.id}, NULL,\
       ${servant.np.name}, ${servant.np.card}, ${servant.np.rank}, ${servant.np.type}, ${servant.np.hits}, ${servant.np.effect}, ${servant.np.oc})"
      await db.none(servantsInsertQuery, { servant,skill1, skill2,skill3 });
    } catch(err) {
      if (!err.message.includes("duplicate key"))
        console.log(err);
    }
  }
}

function getAll() {
  return db.many("SELECT * FROM servants");
}

function getByClass(servantClass, columns) {
  return db.any("SELECT ${columns:name} FROM servants WHERE servants.class = ${servantClass} ORDER BY id ASC",{
    servantClass,
    columns
  });
}

function getById(servantId, columns) {
  return db.one("SELECT ${columns:name} FROM servants WHERE servants.id = ${servantId}",
    {
      servantId,
      columns
    }
  );
}

function getDetails(detailsURL) {
  const query = "SELECT servants.*,\
                 s1.img as skill1_img, s1.name as skill1_name, s1.rank as skill1_rank, s1.description as skill1_description,\
                 s2.img as skill2_img, s2.name as skill2_name, s2.rank as skill2_rank, s2.description as skill2_description,\
                 s3.img as skill3_img, s3.name as skill3_name, s3.rank as skill3_rank, s3.description as skill3_description \
                 FROM servants \
                 LEFT JOIN skills s1 ON servants.skill_1 = s1.id\
                 LEFT JOIN skills s2 ON servants.skill_2 = s2.id\
                 LEFT JOIN skills s3 ON servants.skill_3 = s3.id\
                 WHERE servants.details_url = $1"
  let breakpoint = db.one(query, detailsURL);
  return db.one(query, detailsURL);
}

function updateByField(fieldName, value, id) {
  return db.none("UPDATE servants SET ${fieldName:name} = ${value} WHERE servants.id = ${id}",
    {
      fieldName,
      value,
      id
    }
  );
}
module.exports = { 
  multipleInsert, 
  getAll, 
  getByClass, 
  getById,
  searchByName: (name, columns) => {
    name = '%' + name + '%';
    return db.manyOrNone("SELECT ${columns:name} FROM servants WHERE servants.name ILIKE ${name}", {name, columns});
  }, 
  getDetails, 
  updateByField,
};