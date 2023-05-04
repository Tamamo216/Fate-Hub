const express = require("express");
const router = express.Router();
//MongoDB controller
//const registerController = require("../controllers/mongodb/register");
//PostgresSQL controller
const userController = require("../controllers/postgres/user");
router.get("/", userController.loadRegisterPage);
router.post("/", userController.register);

module.exports = router;