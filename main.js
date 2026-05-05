const dotenv = require('dotenv');
dotenv.config();
const express=require("express")
const mongoose=require("mongoose")
const use_route=require('./apps/abc');
const auth_route=require('./apps/authenticate');
const cookieParser = require("cookie-parser");



const app=express()

mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log('database connection sucessfull')})



app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());

app.use(use_route)
app.use(auth_route)

app.listen(3000,()=>{
console.log("connected sucessfully")
})