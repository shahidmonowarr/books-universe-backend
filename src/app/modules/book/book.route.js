const express = require("express");
const { validateRequest } = require("../../middleware/validateRequest");
const { createUserZod, updateUserZod } = require("./user.validation");
const {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("./user.controller");
const { auth } = require("../../middleware/auth");
const { get } = require("mongoose");
const {
  createBook,
  getSingleBook,
  updateBook,
  deleteBook,
  bookReview,
} = require("./book.controller");
const router = express.Router();

router.post("/", auth(), validateRequest(createBookZod), createBook);
router.get("/", getAllBooks);

router.get("/:id", getSingleBook);
router.patch("/:id", auth(), updateBook);
router.delete("/:id", auth(), deleteBook);

router.patch("/review/:id", auth(), bookReview);

module.exports = router;
