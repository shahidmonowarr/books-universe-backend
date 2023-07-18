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
const router = express.Router();

router.route("/").post(validateRequest(createUserZod), createUser).get(
  //   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
  getAllUsers
);

router
  .route("/:id")
  .get(
    // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
    getSingleUser
  )
  .patch(
    validateRequest(updateUserZod),
    // auth(ENUM_USER_ROLE.SELLER),
    updateUser
  )
  .delete(
    //   auth(ENUM_USER_ROLE.SELLER),
    deleteUser
  );

module.exports = router;
