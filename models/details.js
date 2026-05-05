const mongoose=require('mongoose')
const{body,validationResult}=require("express-validator")


let validationRegister=[
  body("name").notEmpty().withMessage("enter teh name"),
  body("contact").notEmpty().withMessage("enter the number").isLength({min:10,max:10}).withMessage("real number ")
  .isNumeric().withMessage('Only numbers allowed')
]


const detail_schem=mongoose.Schema({
   name:{type:String
   },
   contact:{type:String},
   created_by:{type:String}

})

const register_user=mongoose.Schema({
   name:{type:String},
   number:{type:String},
   password:{type:String}
})



const Contact=mongoose.model('Contact',detail_schem)
const Register=mongoose.model('login',register_user)



module.exports = {
  Contact,
  Register,
  validationRegister
}