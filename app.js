const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./model/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {validCampgroundSchema, validReviewSchema} = require('./validSchemas');
const Review = require("./model/review");
mongoose
  .connect(
    "mongodb+srv://yagnesh:yelpcamp@cluster0.0s9kp.mongodb.net/firstDataBase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then(() => {
    console.log("successful connection to database");
  })
  .catch((err) => {
    console.log(`Database connection err: ${err}`);
  });

app.engine("ejs", ejsMate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//validating middleware

const validateCampground = (req,res,next) =>{
	const {error} = validCampgroundSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400)
	} else{
		next()
	}
}

const validateReview = (req,res,next) =>{
	const {error} = validReviewSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400)
	} else{
		next()
	}
}

app.get("/", (req, res) => {
  res.render("home");
});
//index page for campground
app.get("/campgrounds", catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
}));
//new campground  form
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
//post route to create new campground
app.post("/campgrounds/new", validateCampground, catchAsync( async (req, res) => {
  const newCampground = await Campground.create(req.body.campground);
  res.redirect(`/campgrounds/${newCampground._id}`);
}));
//single campground show
app.get("/campgrounds/:id",catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews');
	// console.log(campground)
  res.render("campgrounds/show", { campground });
}));

//edit campground
app.get("/campgrounds/:id/edit", catchAsync( async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
}));

app.put("/campgrounds/:id", validateCampground,catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );
  res.redirect(`/campgrounds/${campground._id}`);
}));

//delete campground
app.delete("/campgrounds/:id",catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
}));

//Reviews route

app.post('/campgrounds/:id/reviews',validateReview,catchAsync( async(req,res)=>{
	const campground = await Campground.findById(req.params.id)	
	const review = await Review.create(req.body.review)
	campground.reviews.push(review)
	await	campground.save()
	res.redirect(`/campgrounds/${campground._id}`)
}));

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync( async(req,res)=>{
	const{id , reviewId} = req.params;
	await Campground.findByIdAndUpdate(id, {$pull :{reviews: reviewId}});
	await Review.findByIdAndDelete(reviewId);
	res.redirect(`/campgrounds/${id}`);
}));


//NOT Found PAGE
app.all('*',(req,res,next)=>{
	next(new ExpressError('Page not found',404))
})
app.use((err,req,res,next)=>{
	const {statusCode = 500} = err
	if(!err.message) err.message = 'Something went wrong!'
	res.status(statusCode).render('error',{err})
})

//Listening server
app.listen(3000, () => {
  console.log("Server listening on Port 3000");
});
