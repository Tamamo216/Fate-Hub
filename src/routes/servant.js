const express = require("express");
const router = express.Router();
//MongoDB controller
// const servantController = require("../controllers/mongodb/servant");
//PostgreSQL controller
const servantController = require("../controllers/postgres/servant");

router.get("/:servantName", servantController.details);
// router.get("/search", servantController.search);
// router.post("/add", servantController.add);
router.get("/", servantController.load);

module.exports = router;