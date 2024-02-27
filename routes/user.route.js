// const express = require("express");
// const router = express.Router();

// const {
//   getUsers,
//   getUser,
//   postUsers,
//   updateUser,
//   deleteUser
// } = require("../controllers/user.controller");

// const { user_role } = require("../enums/common.enum");
// const { protect, authorize } = require("../middleware/auth");

// router.use(protect);
// router.use(authorize([user_role.ADMIN]));

// router
//   .route("/")
//   .get(getUsers)
//   .post(postUsers);

// router
//   .route("/:id")
//   .get(getUser)
//   .put(updateUser)
//   .delete(deleteUser);

// module.exports = router;

