const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const {jwtkey} = require('../keys')
const router = express.Router();
const Student = mongoose.model('Student');

router.post('/signup',async (req,res)=>{
   
    const {email,password} = req.body;
    const student = await Student.findOne({email})
    if(student){
      return res.status(422).send({error :"EMAIL_EXISTS"})
    }
    try{
      const student = new Student({email,password});
      await  student.save();
      const token = jwt.sign({userId:student._id},jwtkey, { expiresIn: '30m' })
      const decoded = jwt_decode(token)
      const expiresIn = decoded.exp - (new Date().getTime()/1000)
      res.send({token, student, expiresIn})

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
    const student = await Student.findOne({email})
    if(!student){
        return res.status(422).send({error :"EMAIL_NOT_FOUND"})
    }
    try{
      await student.comparePassword(password);    
      const token = jwt.sign({userId:student._id},jwtkey, { expiresIn: '30m' })
      const decoded = jwt_decode(token)
      const expiresIn = decoded.exp - (new Date().getTime()/1000)
      res.send({token, student, expiresIn})
    }catch(err){
        return res.status(422).send({error :"INVALID_PASSWORD"})
    }
})

module.exports = router