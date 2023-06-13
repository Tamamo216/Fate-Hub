const WishList = require("../../models/postgres/wishlists");

module.exports = {
  addToWishlist: function(req,res,next) {
    const userId = req.user.id;
    const servantId = req.body.servantid;
    WishList.insert(userId, servantId)
      .then(() => {
        res.status(200).json({msg: "The chosen servant has been successfully added to your wishlist"});
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({msg: "Something wrong happened. Couldn't add the chosen servant to your wishlist"});
      });
  },
  removeFromWishlist: function (req,res,next) {
    const userId = req.user.id;
    const servantId = req.body.servantId;
    WishList.remove(userId, servantId)
      .then(() => {
        res.status(200).json({msg: "The servant has been successfully removed from your wishlist"});
      })
      .catch(() => {
        res.status(400).json({msg: "Something wrong happended. Couldn't remove the servant from your wishlist"});
      });
  }
}