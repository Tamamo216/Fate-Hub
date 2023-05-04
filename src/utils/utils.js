const fs  = require("fs/promises");
const Servant = require("../models/postgres/servant");
const db = require("../database/postgreSQL");
const levelingCost = require("../config/data/leveling_up_cost.json");
const skillQPCost = require("../config/data/Skills_QP_cost.json");

async function insertServantsIntoDB(filepath) {
  try {
    const rawData = await fs.readFile(filepath, {encoding: "utf-8"});
    let processedData = rawData.split('\n').map(JSON.parse);
    processedData.forEach((servant) => {
      servant.servant_id = parseInt(servant.servant_id);
    });
    processedData.sort((a,b) => a.servant_id - b.servant_id);
    await Servant.multipleInsert(processedData);
  }
  catch (err) {
    console.log(err);
  }
}

async function addDetailsURL() {
  const servants = await db.many("SELECT id, name, class FROM servants");
  for (const servant of servants) {
    const split = servant.name.split(" ");
    let detailsURL = "/servants/" + split.join('-');
    try {
      await db.none("UPDATE servants SET details_url = $1 WHERE id = $2",[detailsURL,servant.id]);
      console.log("query done!");
    }
    catch(err) {
      if (err.message.includes("duplicate key")) {
        console.log(err.message);
        detailsURL += ` (${servant.class})`;
        await db.none("UPDATE servants SET details_url = $1 WHERE id = $2",[detailsURL,servant.id]);
      }
    }
  }
}

async function updateServantField(fieldName, filePath) {
  try {
    const newData = await fs.readFile(filePath, {encoding: "utf-8"});
    const servants = newData.split('\n').map(JSON.parse);
    for (let i = 0; i < servants.length; ++i) {
      await Servant.updateByField(fieldName, servants[i].img_details_path, servants[i].servant_id);
    }
  } catch (err) {
    console.log(err.message);
  }
}

function infoBreakIntoLines(info) {
  let res = [];
  let stack = [];
  let startLine = 0;
  let startIdx = 0;
  const lineBreak = /(\.?\)|\.)\s*/g;
  while ((found = lineBreak.exec(info)) !== null) {
    if (found[0].includes(".)") || found[0].includes(".")) {
      res.push(info.substring(startLine,lineBreak.lastIndex).trim());
      startLine = lineBreak.lastIndex;
      startIdx = lineBreak.lastIndex;
    }
    else if (found[0].includes(")")) {
      for (let i = startIdx; i < lineBreak.lastIndex; ++i) {
        if (info[i] == "(") {
          stack.push(info[i]);
        }
      }
      stack.pop();
      if (stack.length == 0) {
        let line = info.substring(startLine,lineBreak.lastIndex).trim();
        if (res[res.length-1].length + line.length < 70) {
          res[res.length-1] = `${res[res.length-1].trim()} ${line}`;
        }
        else {
          res.push(info.substring(startLine,lineBreak.lastIndex).trim());
        }
        startLine = lineBreak.lastIndex;
      }
      startIdx = lineBreak.lastIndex;
    }
  }
  return res;
}


module.exports = { 
  insertServantsIntoDB, 
  addDetailsURL, 
  updateServantField,
  
  sortServantsByField: (servants, field) => {
    if (field === "class") {
      const classOrder = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin", "Berserker", "Ruler", "Avenger", "Moon Cancer", "Foreigner", "Alter Ego", "Pretender"];
      servants.sort((a,b) => {
        return classOrder.indexOf(a["class"]) - classOrder.indexOf(b["class"]);
      });
    }
    else if (field === "name") {
      servants.sort((a,b) => {
        return a.name.localeCompare(b.name);
      });
    }
    else if (field === "id") {
      servants.sort((a,b) => {
        return a.id - b.id;
      });
    }
    else {
      servants.sort((a,b) => {
        return b[field] - a[field];
      });
    }
  },

  nameMapping: (columnName) => {
    switch (columnName) {
      case "id":
        return "ID";
      case "name":
        return "Name";
      case "class":
        return "Class";
      case "servant_level":
        return "Servant level";
      case "np_level":
        return "NP level";
      case "atk":
        return "ATK";
      case "hp":
        return "HP";
      case "fou_atk":
        return "Fou ATK";
      case "fou_hp":
        return "Fou HP";
      case "bond_lv":
        return "Bond level";
    }
  },
  
  infoBreakIntoLines,
  separateByThousand: (number) => {
    number = String(number);
    for (let i = number.length-3; i > 0; i -= 3) {
      number = number.slice(0,i) + '.' + number.slice(i);
    }
    return number;
  },

  levelingCostCacl: (servantInfo) => {
    let fiveStarExpCardUsed = 0;
    let fourStarExpCardUsed = 0;
    let qpUsed = 0;
    const servantLevel = servantInfo.servant_level;
    let result = [];
    for (let i = 0; i < levelingCost.length; ++i) {
      if (servantLevel < levelingCost[i]["target level"]) {
        let requiredFiveStarExp = levelingCost[i]["5* EXP cards"] - fiveStarExpCardUsed;
        let requiredFourStarExp = levelingCost[i]["4* EXP cards"] - fourStarExpCardUsed;
        let requiredQP = levelingCost[i]["QP cost"] - qpUsed;
        let cost = {
          targetLevel: levelingCost[i]["target level"],
          requiredFiveStarExp,
          requiredFourStarExp,
          requiredQP
        }
        result.push(cost);
      }
      else {
        let requiredFiveStarExp = 0;
        let requiredFourStarExp = 0;
        let requiredQP = 0;
        fiveStarExpCardUsed += levelingCost[i]["5* EXP cards"];
        fourStarExpCardUsed += levelingCost[i]["4* EXP cards"];
        qpUsed += levelingCost[i]["QP cost"];
        let cost = {
          targetLevel: levelingCost[i]["target level"],
          requiredFiveStarExp,
          requiredFourStarExp,
          requiredQP
        };
        result.push(cost);
      }
    }
    return result;
  },

  skillsQPCostCacl: (skill1, skill2, skill3) => {
    let qpCost = {
      skill1: 0,
      skill2: 0,
      skill3: 0,
      total: 0
    }
    for (let i = 0; i < 10; ++i) {
      if (i > skill1-1)
        qpCost.skill1 += skillQPCost[i]["QP cost"];
      if (i > skill2-1)
        qpCost.skill2 += skillQPCost[i]["QP cost"];
      if (i > skill3-1)
        qpCost.skill3 += skillQPCost[i]["QP cost"];
    }
    qpCost.total = qpCost.skill1 + qpCost.skill2 + qpCost.skill3;
    return qpCost;
  }
};