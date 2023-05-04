const express = require("express");
const router = express.Router();
const myServantsController = require("../controllers/postgres/my_servants");

router.get("/", myServantsController.loadHomePage);
router.get("/details/:servantid", myServantsController.loadDetailsPage);
router.put("/details/:servantid", myServantsController.updatetDetails);
router.put("/add-favorite-servants", myServantsController.markAsFavorite);
router.put("/remove-favorite-servants", myServantsController.removeFavorite);
router.get("/add-servant", myServantsController.loadAddServantFirstPage);
router.get("/add-servant/:servantid", myServantsController.loadAddServantSecondPage);
router.post("/add-servant/:servantid", myServantsController.addServant);
router.get("/remove-servants", myServantsController.loadRemoveServantPage);
router.delete("/remove-servants", myServantsController.removeServants);

module.exports = router;