const express = require("express");
const router = express.Router();
const userController = require("../controllers/postgres/user");

router.get("/profile", userController.loadProfilePage);
router.get("/profile/edit", userController.loadProfileEditPage);
router.put("/profile/edit", userController.updateProfile);
router.get("/change-password", userController.loadChangePasswordPage);
router.post("/change-password", userController.changePassword);
router.get("/delete-account", userController.loadRemoveUserPage);
router.delete("/delete-account", userController.removeUser);
module.exports = router;