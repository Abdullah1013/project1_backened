const Joi= require('joi');
const User = require('../models/user')
const bcrypt = require ('bcryptjs');
const utils = require("../utils/index");
const passwordPattern = /^(?=.*\d)[a-zA-Z\d]{5,}$/;
const authController= {
    async register( req,res,next) {
const userRegisterationSchema = Joi.object({
    username : Joi.string().min(5).max(30).required(),
    name:Joi.string().max(30).required(),
    email:Joi.string().email().required(),
    password: Joi.string().pattern(passwordPattern).required()
})
const {error} = userRegisterationSchema.validate(req.body);
if(error){
    return next(error);
}
const {username,name,email,password} = req.body;
try {
    const emailInUse = await User.exists({email});
    const usernameInUse = await User.exists({username});
    if(emailInUse){
        const error = {
            status : 409,
            message : 'Email Already registered'
        }
        return next(error);
    }
    if(usernameInUse){
        const error = {
            status : 409,
            message : 'Username Already registered'
        }
        return next(error);
    }
} catch (error) {
    return next(error);
}
//password hashing
const hashedPassword = await bcrypt.hash(password,10);
const userToRegister = new User({
    username ,
    email,
    name,
    password :hashedPassword

});
const user = await userToRegister.save();
return res.status(201).json({user})
},
    async login( req,res,next) {
        const userLoginSchema = Joi.object({
            email:Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required()
        })
        const {error} = userLoginSchema.validate(req.body);
        if (error){
            return next(error);
        }
        const {email, password}= req.body;
        let user;
        try {
           user=  await User.findOne({email: email});
          if(!user){
            const error={
                status:401,
                message:'Invalid Email'
            }
            return next(error);
          }
          const match= await bcrypt.compare(password,user.password);
          if(!match){
            const error = {
                status : 401,
                message:'Invalid Password'
            }
            return next(error);
        }
        } catch (error) {
            return next(error);
        }
       const token = await utils.JWT.generateToken(user);

        return res.status(200).json({user,token});
    }
}
module.exports = authController;