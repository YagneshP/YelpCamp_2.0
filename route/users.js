const express = require('express');
const User = require('../model/user');
const router = express.Router();

router.get('/register',(req,res)=>{
	res.render('users/register')
})

router.post('/register',async (req,res)=>{
	const {username, email, password} = req.body;
	// create new User instance with username and email
	const user = new User({username, email});
	const newuser =  await User.register(user, password);  //register() method give passportlocalMongoose
	req.flash('success',"Welcome to the YelpCamp!");
	res.redirect("/campgrounds"); 
})

module.exports = router;