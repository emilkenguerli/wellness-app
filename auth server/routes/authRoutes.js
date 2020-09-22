const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const {jwtkey, EMAIL_SECRET, GMAIL_USER, GMAIL_PASS} = require('../keys')
const router = express.Router();
const User = mongoose.model('User');
const nodemailer = require('nodemailer')

router.post('/signup',async (req,res)=>{

    const {email,password, name, studentNum, phone, bookings} = req.body;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        //type: "login",
        user: GMAIL_USER,
        pass: GMAIL_PASS,
      },
      // tls:{
      //     rejectUnauthorized:false
      // }
    });

    const user = await User.findOne({email})
    if(user){
      return res.status(422).send({error :"EMAIL_EXISTS"})
    }
    try{

      const user = new User({email, password, name, studentNum, phone, bookings });
      console.log(user);
      await  user.save();
      const token = jwt.sign({userId:user._id},jwtkey, { expiresIn: '30m' })
      const decoded = jwt_decode(token)
      const expiresIn = decoded.exp - (new Date().getTime()/1000)

      // async email
      jwt.sign(
        {
          userId:user._id
        },
        EMAIL_SECRET,
        {
          expiresIn: '1d',
        },
        (err, emailToken) => {
          const url = `http://localhost:9000/confirmation/${emailToken}`;

          transporter.sendMail({
            to: email,
            subject: 'Confirm Email',
            html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
          });
        },
      );

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
    if(!user.confirmed){
      return res.status(422).send({error :"EMAIL_NOT_CONFIRMED"})
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