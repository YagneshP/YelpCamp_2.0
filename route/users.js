const express = require('express');
const User = require('../model/user');
const router = express.Router();
const catchAsync = require("../utils/catchAsync")

router.get('/register',(req,res)=>{
	res.render('users/register')
})

router.post('/register', catchAsync(async (req,res, next)=>{
try{
	const {username, email, password} = req.body;
	// create new User instance with username and email
	const user = new User({username, email});
	const newuser =  await User.register(user, password);  //register() method give passportlocalMongoose
	req.login(newuser,(err)=>{
		if(err) return next(err);
		req.flash('success',"Welcome to the YelpCamp!");
		res.redirect("/campgrounds");
	})	 
} catch(err){
	req.flash('error', err.message);
	res.redirect('register')
}

}));

module.exports = router;