const express = require('express');
const User = require('../model/user');
const router = express.Router();

router.get('/register',(req,res)=>{
	res.render('users/register')
})

router.post('/register',async (req,res)=>{
	const newUser = await User.register()
})

module.exports = router;