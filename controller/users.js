const User = require("../model/user");

//** Register Form */
const renderRegisterForm = (req,res)=>{
	res.render('users/register')
}
//** Register User */
const register = async (req,res, next)=>{
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
	}

//** Login Form */
const renderLoginForm = (req,res)=>{
	res.render('users/login')
}

const userLogin  = (req,res)=>{
	req.flash('success',`Welcomeback! ${req.user.username}`);
	const redirectUrl = req.session.returnTo || '/campgrounds';
	delete req.session.returnTo;
	res.redirect(redirectUrl)
}

const userLogout = (req,res)=>{
	req.logout();
	req.flash('success','GoodBye!');
	res.redirect("/campgrounds");
}

module.exports = {
	renderRegisterForm,
	register,
	renderLoginForm,
	userLogin,
	userLogout
}