const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,validateCampground} = require("../middleware");
const campgrounds = require("../controller/campgrounds")

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