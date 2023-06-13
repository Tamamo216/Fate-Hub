const express = require("express");
const router = express.Router();
const userController = require("../controllers/postgres/user");
const dailySQGainController = require("../controllers/postgres/get_daily_sq");
const wishListController = require("../controllers/postgres/wishlist");

router.get("/profile", userController.loadProfilePage);
router.get("/profile/edit", userController.loadProfileEditPage);
router.put("/profile/edit", userController.updateProfile);
router.get("/change-password", userController.loadChangePasswordPage);
router.post("/change-password", userController.changePassword);
router.get("/delete-account", userController.loadRemoveUserPage);
router.delete("/delete-account", userController.removeUser);
router.get("/daily-sq", dailySQGainController.getDailySQ);
router.post("/wishlist/add", wishListController.addToWishlist);
router.delete("/wishlist/remove", wishListController.removeFromWishlist);
router.get("/rolling-histories", userController.loadRollingHistPage);
module.exports = router;