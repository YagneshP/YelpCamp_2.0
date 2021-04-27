const express 		= require('express')
const app 				= express()
const path   			= require('path')
const mongoose 		= require('mongoose')
const Campground 	= require('./model/campground')
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants')


mongoose.connect('mongodb+srv://yagnesh:yelpcamp@cluster0.0s9kp.mongodb.net/firstDataBase?retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology:true})
				.then(()=>{
							console.log("successful connection to database")})
				.catch((err)=>{console.log(`Database connection err: ${err}`) })

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.set('view engine','ejs')
app.set('views',path.join(__dirname, 'views'));

app.get("/",(req,res)=>{
	res.render('home')
})
//index page for campground
app.get('/campgrounds', async (req,res)=>{
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index',{campgrounds})
})
//new campground  form
app.get("/campgrounds/new",(req,res)=>{
	res.render('campgrounds/new')
})
//post route to create new campground
app.post("/campgrounds/new", async (req,res)=>{
	console.log(req.body);
	const newCampground = await Campground.create(req.body)
	res.redirect('/campgrounds')
})
//single campground show
app.get('/campgrounds/:id', async (req,res)=>{
	const campground = await Campground.findById(req.params.id)
	res.render('campgrounds/show',{campground})
})


//Listening server
app.listen(3000,()=>{
	console.log('Server listening on Port 3000')
})