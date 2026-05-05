const express=require("express")
const mongoose=require("mongoose")
const { Contact, Register,validationRegister} = require("../models/details")
const{body,validationResult}=require("express-validator")
const jwt=require("jsonwebtoken")


const router=express.Router()

function authMiddleware(req, res, next) {
  // const authHeader = req.headers.authorization;

  // if (!authHeader) {
  //   return res.status(401).send("No token provided");
  // }

  // const token = authHeader.split(" ")[1]; // Bearer <token>
  const token=req.cookies.token
  try {
    const decoded = jwt.verify(token,  process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).redirect('/login');
  }
}





// start




router.get('/',authMiddleware,async(req,res)=>{
try{
const details = await Contact.find({
  "created_by": req.user.userId
});
 return res.render('abc',{"details":details})
}catch(err){
 return res.status(500).send('not found')
}
})


router.get('/add', (req, res) => {
  try{
    return res.render('forms',{msg:''})
  }
  catch(err){
    res.status(404).send('not found')
  }
})

router.post('/add',authMiddleware,validationRegister,async (req,res)=>{
const error=validationResult(req)

if(error.isEmpty()){
const detail= await Contact.create({
    "name":req.body.name,
    "contact":req.body.contact,
    "created_by":req.user.userId
});
res.redirect('/')
}
else{
res.send(error)
}
})


router.get('/update/:_id',async (req, res) => {
    const details= await Contact.findById(req.params._id)
    res.render('update',{msg:details})
})

router.post('/update/:_id',validationRegister,async (req,res)=>{
const error=validationResult(req)
if(error.isEmpty()){
const detail= await Contact.findByIdAndUpdate(req.params._id,{
  "name":req.body.name,
  "contact":req.body.contact
});
res.redirect('/')
}
else{
res.send("error")
}
});


router.get('/delete/:_id',async (req,res)=>{
const detail= await Contact.findByIdAndDelete(req.params._id)
res.redirect('/')
})

module.exports=router;