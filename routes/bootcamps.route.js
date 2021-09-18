const express = require("express");
const router = express.Router();

const {getBootcamps,
      getBootcamp,
      postBootcamps,
      updateBootcamp,
      deleteBootcamp   
      } = require("../controllers/bootcamp.contaroller");
const {protect,authorize} =require("../middleware/auth")

router 
    .route("/")
    .get(getBootcamps)
    .post(protect,authorize("publisher","admin"),postBootcamps);
    
router
    .route("/:id")
    .get(getBootcamp)
    .put(protect,authorize("publisher","admin"),updateBootcamp)
    .delete(protect,authorize("publisher","admin"),deleteBootcamp);

module.exports = router;    

