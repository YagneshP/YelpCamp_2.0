const express = require('express');
const router = express.Router();
const {validCampgroundSchema} = require('../validSchemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require("../model/campground");
const {isLoggedIn} = require("../middleware");
const campgrounds = require("../controller/campgrounds")
const validateCampground = (req,res,next) =>{
	const {error} = validCampgroundSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400)
	} else{
		next()
	}
}

//index page 
router.get("/", catchAsync(campgrounds.index));

//new campground  
router.route("/new")
			.get(isLoggedIn, campgrounds.renderNewCampFrom)
			.post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

//single campground show/update/delete
router.route("/:id")
			.get(catchAsync(campgrounds.showCampground))
			.put(isLoggedIn, validateCampground,catchAsync(campgrounds.updateCampground))
			.delete(isLoggedIn,catchAsync(campgrounds.deleteCampground));

//edit campground Form
router.get("/:id/edit",isLoggedIn, catchAsync(campgrounds.renderEditCampFrom));





module.exports = router;