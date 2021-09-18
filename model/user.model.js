const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name :{
    type : String,
    required :[true , "please enter your  name"]
  },

  email:{
    type : String,
    // unique : true,
    // trim : true,
    required:[true , "please enter your email"],
    match :[
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "please add a valid email"
    ]
  },

  role:{
    type:String,
    enum:["user","publisher"],
    default:"user"
  },

  password:{
    type:String,
    required:[true,"please add a password"],
    minlength:6,
    select:false
  },

  // resetPasswordToken :String,
  
  // resetPasswordExpire :Date,
  
  createAt:{
    type : Date,
    default : Date.now
  },

});

// Encrypt password using bcrypt
userSchema.pre("save" ,async function(next) {

  if(!this.isModified("password")){
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password , salt);
});

// Sign JWT and return 
userSchema.methods.getSignedJwtToken =function (){
  return jwt.sign({id :this._id},process.env.JWT_SECRET,{
    expiresIn :process.env.JWT_EXPIRE
  });
};

// Match User entered password to hashed in database
userSchema.methods.matchPassword = async function(enterdPassword){
  return await bcrypt.compare(enterdPassword,this.password);
};

// // Generate and Hash password token
// userSchema.methods.getResetPasswordToken = function(){
//   // Geranarate token
//   const resertToken = crypto.randomBytes(20).toString("hex");

//   // Hash token and set to resertpassword feild
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resertToken)
//     .digest("hex");

//   // Set expire
//   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

//   return resertToken;
// };

module.exports = mongoose.model("User", userSchema)