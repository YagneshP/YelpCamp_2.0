const {validCampgroundSchema} = require('./validSchemas');
const ExpressError = require('./utils/ExpressError');

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

// user loggedin or Not
const isLoggedIn = (req,res,next)=>{
	if(!req.isAuthenticated()){
		req.session.returnTo = req.originalUrl;
		req.flash('error',"You need to login first");
	return	res.redirect("/login")
	}
	next()
}

module.exports = {
	isLoggedIn,
	validateCampground
}