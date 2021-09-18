const mongoose = require("mongoose");
const slugify = require("slugify");

const BootcampSchema = new mongoose.Schema({
  name :{
    type : String,
    required : [true,"Please add a name"],
    unique : true,
    trim : true,
    maxlength :[50, "Name cannot be more than 50 characters" ]
  },

  slug : String,

  description :{
    type : String,
    maxlength :[500, "Description cannot be more than 50 characters" ]
  },

  website :{
    type : String,
    match :[
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid url with HTTP or HTTPS"

    ]
  },

  phone :{
    type : String,
    maxlength :[11,"Phone number cannot be longer then 11 characters"]
  },

  email:{
    type : String,
    match :[
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "please add a valid email"
    ]
  },

  address :{
    type : String,
    required :[true,"please add address"],
    location:{
      // GeoJSON point
      type :{
        type:String,
        enum :["point"],
        required : true
      },
      coordinates :{
        type:[Number],
        required : true,
        index : "2dsphere"
      },
      formattedAddress : String,
      street : String,
      city : String,
      state : String,
      zipcode : String,
      country : String
    },
  },

  

  careers :{
    // Array of String
    type:[String],
    required : true,
    enum:[
      "Web Development",
      "Mobile Devolopment",
      "UI/UX",
      "Data Science",
      "Business",
      "other"
    ]
  },

  photo :{
    type:String,
    default: "no-photo.jpg"
  },

  housing:{
    type :Boolean,
    default:false
  },
  
  rate :{
    type : Number
  },
  
  createAt:{
    type :Date,
    default:Date.now
  },

  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true
  }

});

// Create bootcamps slug from the name
BootcampSchema.pre("save" , function(next){
  this.slug = slugify(this.name , {lower : true});
  next();
});

module.exports = mongoose.model('Bootcamp',BootcampSchema)