const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User')
const {jwtkey} = require('../keys')

/**
 * Only allows the request to take place successfully if the token passed is valid
 * @param {*} req : the JSON request received
 * @param {*} res : the JSON respons sent by this method
 * @param {*} next : executes next middleware function if there is one
 */

module.exports = (req,res,next)=>{
       const { authorization } = req.headers;
       if(!authorization){
           return res.status(401).send({error:"you must be logged in"})
       }
       const token = authorization.replace("Bearer ","");
       jwt.verify(token,jwtkey,async (err,payload)=>{
           if(err){
             return  res.status(401).send({error:"you must be logged in 2"})
           }
        const {userId} = payload;
        const user = await User.findById(userId)
        req.user=user;
        next();
       })
}