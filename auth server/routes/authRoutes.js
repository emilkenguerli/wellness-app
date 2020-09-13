const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const {jwtkey} = require('../keys')
const router = express.Router();
const User = mongoose.model('User');

router.post('/signup',async (req,res)=>{

    const {email,password, username, bookings} = req.body;

    const user = await User.findOne({email})
    if(user){
      return res.status(422).send({error :"EMAIL_EXISTS"})
    }
    try{

      const user = new User({email, password, username, bookings });
      console.log(user);
      await  user.save();
      //console.log("jy");
      const token = jwt.sign({userId:user._id},jwtkey, { expiresIn: '30m' })
      const decoded = jwt_decode(token)
      const expiresIn = decoded.exp - (new Date().getTime()/1000)
      res.send({token, user, expiresIn})


    }catch(err){
      return res.status(422).send(err.message)
    }
    
    
})

router.post('/signin',async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).send({error :"Must provide email or password"})
    }
    console.log({email});
    const user = await User.findOne({email})
    if(!user){
        return res.status(422).send({error :"EMAIL_NOT_FOUND"})
    }
    try{
      await user.comparePassword(password);    
      const token = jwt.sign({userId:user._id},jwtkey, { expiresIn: '30m' })
      const decoded = jwt_decode(token)
      const expiresIn = decoded.exp - (new Date().getTime()/1000)
      res.send({token, user, expiresIn})
    }catch(err){
        return res.status(422).send({error :"INVALID_PASSWORD"})
    }
})

module.exports = router