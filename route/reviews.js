const express = require('express');
const router = express.Router({mergeParams:true});
const {validReviewSchema} = require('../validSchemas');
const Campground = require("../model/campground");
const Review = require('../model/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const{isLoggedIn} = require("../middleware")
const validateReview = (req,res,next) =>{
	const {error} = validReviewSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400)
	} else{
		next()
	}
}

router.post('/',isLoggedIn,validateReview,catchAsync( async(req,res)=>{
	const campground = await Campground.findById(req.params.id)	
	const review = await Review.create({...req.body.review,author:req.user._id});
	campground.reviews.push(review)
	await	campground.save()
	req.flash('success', 'Created new review!');
	res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:reviewId',isLoggedIn, catchAsync( async(req,res)=>{
	const{id , reviewId} = req.params;
	await Campground.findByIdAndUpdate(id, {$pull :{reviews: reviewId}});
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Successfully deleted review')
	res.redirect(`/campgrounds/${id}`);
}));


module.exports = router;