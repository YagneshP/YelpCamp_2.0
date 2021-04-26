const express = require('express')
const app 		= express()
const path   	= require('path')
const mongoose = require('mongoose')
const Campground = require('./model/campground')

// mongoose.connect()


app.set('view engine','ejs')
app.set('views',path.join(__dirname, 'views'));

app.get("/",(req,res)=>{
	res.render('home')
})

app.get('/campgrounds', async (req,res)=>{
	// const campgrounds = await Campground.find({})
	res.render('campgrounds/index')
})

//Listening server
app.listen(3000,()=>{
	console.log('Server listening on Port 3000')
})