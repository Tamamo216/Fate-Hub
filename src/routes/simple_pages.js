const express = require("express");
const router = express.Router();

const simpleController = require("../controllers/simple_pages");

router.get("/", simpleController.loadHomePage);
router.get("/about-us", simpleController.loadAboutUs);

module.exports = router;
