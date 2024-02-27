const Bootcamp = require("../model/bootcamp.model");
const ErrorResponse= require("../utilis/errorResponse");
const asyncHandler = require("../middleware/async");


//@desc    Get All Bootcamps
//@route   Get/api/v1/bootcamps
//access   public
exports.getBootcamps = asyncHandler(async (req,res,next) =>{
  let query;

  // Copy query
  const reqQuery ={...req.query};

  // Fields to exclude
  const removeFields =["select","sort"]

  // Loop Over remove fields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create Oparetor ($gt,$gte,etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`);

  // Finding Resource
  query=Bootcamp.find(JSON.parse(queryStr));

  // Select Fields
  if(req.query.select){
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if(req.query.sort){
    const sortBy=req.query.sort.split(",").join(" ");
    query=query.sort(sortBy)
  }else{
    query=query.sort("-cresteAt");
  }

  // Exscuting query
  const bootcamps = await query;

  res.status(200).json({
    success : true,
    message: `List of Bootcamps`,
    count : bootcamps.length,
    data : bootcamps
  });

});

//@desc    Get Single Bootcamp
//@route   Get/api/v1/bootcamps/:id
//access   public
exports.getBootcamp = asyncHandler( async (req,res,next) =>{
  const bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp){
    return next(
      new ErrorResponse (`Bootcamp Not Found With Id Of ${req.params.id}`,404)
    );
  }

  res.status(200).json({
    success : true,
    message: `Bootcamp of id ${req.params.id}`,
    data : bootcamp
  });

});

//@desc    Post Bootcamps 
//@route   Post/api/v1/bootcamps
//@access   public
exports.postBootcamps =asyncHandler( async (req,res,next) =>{
  // Add ser To Req.body
  req.body.user = req.user.id;

  // Check publish bootcamp
  const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});
  
  // If user is not a admin ,they can add only one bootcamp
  if(publishedBootcamp && req.user.role !== "admin"){
    return next(new ErrorResponse(`The user with Id ${req.user.id} has already published a bootcamps`,400));
  };

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success:true,
    message: `Bootcamp created successfully`,
    data :bootcamp
  });

});

//@desc    Update Single Bootcamp
//@route   Put/api/v1/bootcamps/:id
//@access  private
exports.updateBootcamp =asyncHandler(async (req,res,next) =>{
  let bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp){
    return next(
      new ErrorResponse (`Bootcamp Not Found With Id Of ${req.params.id}`,404)
    );
  }

  // Make sure Bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== "admin"){
    return next (new ErrorResponse (`User ${req.params.id} is not authorized to update is bootcamp`,404))
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id , req.body,{
    new:true,
    runValidators :true
  })

  res.status(200).json({
    success : true,
    message: `Bootcamp of id ${req.params.id} updated successfully`,
    data : bootcamp
  });

});

//@desc    Delete Single Bootcamp
//@route   Delete/api/v1/bootcamps/:id
//access   public
exports.deleteBootcamp =asyncHandler(async(req,res,next) =>{
  let bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp){
    return next(
      new ErrorResponse (`Bootcamp Not Found With Id Of ${req.params.id}`,404)
    );
  }

// Make sure Bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== "admin"){
    return next (new ErrorResponse (`User ${req.params.id} is not authorized to update is bootcamp`,404))
  }

  bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success : true,
    message: `Bootcamp of id ${req.params.id} deleted successfully`,
    data : {}
  });

});