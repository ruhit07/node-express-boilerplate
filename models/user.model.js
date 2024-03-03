const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "please enter your email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "please add a valid email"
    ]
  },
  password: {
    type: String,
    required: [true, "please add a password"],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User"
  },
  createAt: {
    type: Date,
    default: Date.now
  },

});

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return 
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({
    id: this._id
  }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE // in days 
  });
};

// Match User entered password to hashed in database
userSchema.methods.matchPassword = async function (enterdPassword) {
  return  await bcrypt.compare(enterdPassword, this.password);
};


module.exports = mongoose.model("User", userSchema)