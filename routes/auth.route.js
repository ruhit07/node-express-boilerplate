const express = require("express");
const { protect } = require("../middleware/auth")
const { regester, login, getMe, logout, getUsers } = require("../controllers/auth.controller");

const router = express.Router();

router.route("/register").post(regester);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/users").get(getUsers);
router.route("/me").get(protect, getMe);


module.exports = router;
