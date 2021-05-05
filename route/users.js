const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const users = require("../controller/users");

router.route('/register')
.get(users.renderRegisterForm)
.post(catchAsync(users.register));

//user login 
router.route('/login')
.get(users.renderLoginForm)
.post(passport.authenticate('local',{failureFlash:true, failureRedirect:"/login"}),users.userLogin)

//logout
router.get("/logout",users.userLogout)
module.exports = router;