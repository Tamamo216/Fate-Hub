const utils = require("../../utils/utils");
const path = require("path");

async function insert(req,res,next) {
  const filename = req.query.filename;
  const filepath = path.resolve("./src", "config", "data", filename);
  try {
    await utils.insertServantsIntoDB(filepath);
    await utils.addDetailsURL();
    res.status(200).json({msg: "New servants data have successfully inserted to Database"});
  }
  catch (err) {
    next(err);
  }
}

module.exports = { insert };