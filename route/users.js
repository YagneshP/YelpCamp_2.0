const express = require('express');
const passport = require('passport');
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
	req.login(newuser,(err)=>{  // req.login will add user object to the req object
		if(err) return next(err);
		req.flash('success',"Welcome to the YelpCamp!");
		res.redirect("/campgrounds");
	})	 
} catch(err){
	req.flash('error', err.message);
	res.redirect('register')
}
}));

//user login 

router.get('/login',(req,res)=>{
	res.render('users/login')
});

router.post('/login', passport.authenticate('local',{failureFlash:true, failureRedirect:"/login"}),(req,res)=>{
	req.flash('success',`Welcomeback! ${req.user.username}`);
	const redirectUrl = req.session.returnTo || '/campgrounds';
	delete req.session.returnTo;
	res.redirect(redirectUrl)
})

//logout
router.get("/logout",(req,res)=>{
	req.logout();
	req.flash('success','GoodBye!');
	res.redirect("/campgrounds");
})
module.exports = router;