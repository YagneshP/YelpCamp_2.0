const express 		= require('express')
const app 				= express()
const path   			= require('path')
const mongoose 		= require('mongoose')
const Campground 	= require('./model/campground')
const methodOverride = require('method-override')



mongoose.connect('mongodb+srv://yagnesh:yelpcamp@cluster0.0s9kp.mongodb.net/firstDataBase?retryWrites=true&w=majority',
									{useNewUrlParser:true, 
									 useUnifiedTopology:true,
									 useFindAndModify:false
									})
				.then(()=>{
							console.log("successful connection to database")})
				.catch((err)=>{console.log(`Database connection err: ${err}`) })

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

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
	const newCampground = await Campground.create(req.body.campground)
	res.redirect(`/campgrounds/${newCampground._id}`)
})
//single campground show
app.get('/campgrounds/:id', async (req,res)=>{
	const campground = await Campground.findById(req.params.id)
	res.render('campgrounds/show',{campground})
})

//edit campground
app.get('/campgrounds/:id/edit',async (req,res)=>{
	const campground = await Campground.findById(req.params.id)
	res.render('campgrounds/edit',{campground})
})

app.put('/campgrounds/:id', async (req,res)=>{
	const {id} = req.params
	const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground},{new:true})
	res.redirect(`/campgrounds/${campground._id}`)
})

//Listening server
app.listen(3000,()=>{
	console.log('Server listening on Port 3000')
})