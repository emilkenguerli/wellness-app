const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Student = mongoose.model('Student')
const {jwtkey} = require('../keys')

module.exports = (req,res,next)=>{
       const { authorization } = req.headers;
       //authorization === Bearer sfafsafa
       if(!authorization){
           return res.status(401).send({error:"you must be logged in"})
       }
       const token = authorization.replace("Bearer ","");
       //console.log(token);
       jwt.verify(token,jwtkey,async (err,payload)=>{
           if(err){
             return  res.status(401).send({error:"you must be logged in 2"})
           }
        const {studentId} = payload;
        const student = await Student.findById(studentId)
        req.student=student;
        next();
       })
}