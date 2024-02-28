const express = require("express");
const { protect } = require("../middleware/auth");

const {
  regester,
  login,
  logout,
  getMe,
  // deleteMe,
  // updateDetails,
  // updatePassword
} = require("../controllers/auth.controller");

const router = express.Router();

router.post('/register', regester);
router.post('/login', login);
router.delete('/logout', logout);
router.get('/me', protect, getMe);
// router.delete('/me', protect, deleteMe);
// router.put('/updatedetails', protect, updateDetails);
// router.put('/updatepassword', protect, updatePassword);


module.exports = router;
