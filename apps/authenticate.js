const express=require("express")
const mongoose=require("mongoose")
const { Contact, Register,validationRegister} = require("../models/details")
const{body,validationResult}=require("express-validator")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")


const router=express.Router()

async function hashPassword(plainPassword) {
  const hashed = await bcrypt.hash(plainPassword, 10);
  return hashed;
}


//start 



router.get('/register',(req,res)=>{
 res.render('register',{detail:'register'})
})

router.post('/register',async (req,res)=>{
const hash= await hashPassword(req.body.password)
const number=await Register.findOne({number:req.body.number})

if(number){

    return res.status(409).send('already exists')
}
const login_detail=await Register.create({
  "name":req.body.name,
  "number":req.body.number,
  "password":hash
})


 res.redirect('/login')

})

router.get('/login',(req,res)=>{
res.render('register',{detail:'login'})
})


router.post('/login',async (req,res)=>{
    const {number,password}=await req.body
    const user = await Register.findOne({number:number});

    if (!user) {
    return res.status(400).send("Number not found");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
    return res.status(400).send("Invalid password");
    }

    const token = jwt.sign(
        { userId: user._id, number: user.number },
         process.env.JWT_SECRET,   // store in .env in real apps
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
    httpOnly: true,      // prevents JS access (important)
    secure: false,       // set true in production (HTTPS)
    maxAge: 3600000      // 1 hour
    });

   res.redirect("/")


})

router.get('/logout',(req,res)=>{

res.clearCookie('token', {
  httpOnly: true,
  secure: false
});
res.redirect('/login')

})









module.exports=router;