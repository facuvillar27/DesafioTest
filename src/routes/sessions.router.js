// import jwt from 'jsonwebtoken';
// import Users from "../dao/dbManagers/users.js";
// import Products from "../dao/dbManagers/products.js";

import { Router } from "express";
import passport from "passport";
import { passportCall } from "../utils.js";
import { createTokenAndUserDTO, getProfile, sendEmail, passwordReset, resetUserPassword, updateUser} from "../controller/sessions.controller.js";

const router = Router();

router.post('/register',passport.authenticate('register',{passReqToCallback:true,session:false,failureRedirect:'api/sessions/failedRegister',failureMessage:true}),(req,res)=>{
    sendEmail(req);
    res.send({status:"success",message:"User registered, email sent",payload:req.user._id});
});

router.get('/failedRegister',(req,res)=>{
    res.send("failed Register");
})

router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/failedLogin',session:false}),(req,res)=>{
    const { token, serializedUser } = createTokenAndUserDTO(req);
    res.cookie('coderCookie',token,{maxAge:3600000}).send({status:"success",payload:serializedUser});
})

router.get('/failedLogin',(req,res)=>{
    console.log(req.message);
    res.send("failed Login");
})

router.get('/current', passportCall("jwt"), getProfile);

router.post('/forgot-password', passwordReset);

router.get('/reset/:rid', resetUserPassword);

router.post('/reset/:rid', updateUser)

export default router;