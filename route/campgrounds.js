const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,validateCampground,isAuthorized} = require("../middleware");
const campgrounds = require("../controller/campgrounds")
const {storage} = require('../cloudinary')
const multer = require('multer');
const upload = multer({ storage});
//index page 
router.get("/", catchAsync(campgrounds.index));

//new campground  
router.route("/new")
			.get(isLoggedIn, campgrounds.renderNewCampFrom)
			.post(isLoggedIn, upload.array('image',3), validateCampground, catchAsync(campgrounds.createCampground));

//single campground show/update/delete
router.route("/:id")
			.get(catchAsync(campgrounds.showCampground))
			.put(isLoggedIn, isAuthorized,upload.array('image',3),validateCampground,catchAsync(campgrounds.updateCampground))
			.delete(isLoggedIn, isAuthorized,catchAsync(campgrounds.deleteCampground));

//edit campground Form
router.get("/:id/edit",isLoggedIn,isAuthorized, catchAsync(campgrounds.renderEditCampFrom));

module.exports = router;