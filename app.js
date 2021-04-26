const express = require('express')
const app = express()


app.get("/",(req,res)=>{
	res.send("the future home page for the app")
})

//Listening server
app.listen(3000,()=>{
	console.log('Server listening on Port 3000')
})