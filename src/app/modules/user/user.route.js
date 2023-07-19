const express = require("express");
const { validateRequest } = require("../../middleware/validateRequest");
const { updateUserZod } = require("./user.validation");
const {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getUserProfile,
  addToWishlist,
  removeFromWishlist,
  addToReadList,
  markAsCompleted,
} = require("./user.controller");
const { auth } = require("../../middleware/auth");
const router = express.Router();

router.route("/profile").get(auth(), getUserProfile);
router.route("/").get(getAllUsers);
router.route("/:id").get(getSingleUser);
router.route("/id").patch(validateRequest(updateUserZod), updateUser);
router.route("/:id").delete(deleteUser);

router.route("/add-wishlist").patch(auth(), addToWishlist);
router.route("/remove-wishlist").patch(auth(), removeFromWishlist);

router.route("/add-readlist").patch(auth(), addToReadList);
router.route("mark-finished").patch(auth(), markAsCompleted);

module.exports = router;
