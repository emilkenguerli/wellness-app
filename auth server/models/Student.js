const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const studentSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

studentSchema.pre('save',function(next){
    const student = this;
    if(!student.isModified('password')){
        return next()
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
            return next(err)
        }
     bcrypt.hash(student.password,salt,(err,hash)=>{
         if(err){
             return next(err)
         }
         student.password = hash;
         next()
     })

    })

})


studentSchema.methods.comparePassword = function(candidatePassword) {
    const student = this;
    return new Promise((resolve,reject)=>{
        bcrypt.compare(candidatePassword,student.password,(err,isMatch)=>{
            if(err){
                return reject(err)
            }
            if (!isMatch){
                return reject(err)
            }
            resolve(true)
        })
    })

}

mongoose.model('Student',studentSchema);