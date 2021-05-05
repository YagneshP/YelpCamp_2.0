const {validCampgroundSchema, validReviewSchema} = require('./validSchemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require("./model/campground");
const Review = require('./model/review');

//Validating incoming campground with Joi
const validateCampground = (req,res,next) =>{
	const {error} = validCampgroundSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400)
	} else{
		next()
	}
}

//Validating incoming review
const validateReview = (req,res,next) =>{
	const {error} = validReviewSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400)
	} else{
		next()
	}
}

// user loggedin or Not
const isLoggedIn = (req,res,next)=>{
	if(!req.isAuthenticated()){
		req.session.returnTo = req.originalUrl;
		req.flash('error',"You need to login first");
	return	res.redirect("/login")
	}
	next()
}

// authorized user
const isAuthorized = async(req,res,next) => {
	const {id} = req.params;
	const foundCampground = 	await Campground.findById(id);
	if(foundCampground.author.equals(req.user._id)){
		next()
	} else {
		req.flash('error','You are Unauthorized');
		res.redirect("/campgrounds")
	}
} 	

//authReview

const isAuthReview = async(req,res,next) =>{
	const{reviewId} = req.params;
	const foundReview = await Review.findById(reviewId);
	if(foundReview.author.equals(currentUser)){
		next()
	}
	req.flash('error','You are not authorized');
	return res.redirect("/campgrounds");
}

module.exports = {
	isLoggedIn,
	validateCampground,
	isAuthorized,
	isAuthReview,
	validateReview
}