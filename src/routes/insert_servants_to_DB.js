const express = require("express");
const router = express.Router();
const controller = require("../controllers/postgres/insert_servants_to_DB");

router.get("/", controller.insert);

module.exports = router;