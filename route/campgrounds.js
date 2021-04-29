const express = require('express');
const router = express.Router();
const {validCampgroundSchema} = require('../validSchemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require("../model/campground");
const validateCampground = (req,res,next) =>{
	const {error} = validCampgroundSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400)
	} else{
		next()
	}
}

//index page for campground
router.get("/", catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
}));
//new campground  form
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});
//post route to create new campground
router.post("/new", validateCampground, catchAsync( async (req, res) => {
  const newCampground = await Campground.create(req.body.campground);
  res.redirect(`/campgrounds/${newCampground._id}`);
}));
//single campground show
router.get("/:id",catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews');
	// console.log(campground)
  res.render("campgrounds/show", { campground });
}));

//edit campground
router.get("/:id/edit", catchAsync( async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
}));

router.put("/:id", validateCampground,catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );
  res.redirect(`/campgrounds/${campground._id}`);
}));

//delete campground
router.delete("/:id",catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
}));

module.exports = router;