const express = require("express");
const { validateRequest } = require("../../middleware/validateRequest");
const { auth } = require("../../middleware/auth");
const {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
  bookReview,
} = require("./book.controller");
const { createBookZod } = require("./book.validation");
const router = express.Router();

router.post("/", auth(), validateRequest(createBookZod), createBook);
router.get("/", getAllBooks);

router.get("/:id", getSingleBook);
router.patch("/:id", auth(), updateBook);
router.delete("/:id", auth(), deleteBook);

router.patch("/review/:id", auth(), bookReview);

module.exports = router;
