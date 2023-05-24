const express = require("express");
const router = express.Router();
//MongoDB controller
// const servantController = require("../controllers/mongodb/servant");
//PostgreSQL controller
const servantController = require("../controllers/postgres/servant");
const servantPurchasingController = require("../controllers/postgres/servant_purchasing");

router.get("/purchase/:servantid", servantPurchasingController.loadPurchasePage);
router.post("/purchase/:servantid", servantPurchasingController.rollingServant);
router.get("/purchase", servantPurchasingController.loadHomePage);
router.get("/:servantName", servantController.details);
router.get("/", servantController.load);

module.exports = router;