const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

/**
 * The MongoDB model of the students collection
 */

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    confirmed:{
        type:Boolean,
        default: false
    },
    password:{
        type:String,
        required:true
    },
    resetPassword:{
        code: {type: String},
        token: {type: String},
        verified:{type:Boolean, default: false}
    },
    name:{
        type:String,
        unique:true,
        required:true
    },
    studentNum:{
        type:String,
        unique:true,
        required:true
    },
    phone:{
        type:String
    },
    bookings:{
        type:[],
        required:true
    }
    
}, {collection: 'students'})

/**
 * When a new student is being added their password is encrypted using becrypt before being stored
 */

userSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')){
        return next()
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
            return next(err)
        }
     bcrypt.hash(user.password,salt,(err,hash)=>{
         if(err){
             return next(err)
         }
         user.password = hash;
         next()
     })

    })

})

/**
 * When a student's password is being updated, their password is encrypted using becrypt before being stored
 */

userSchema.pre('update',function(next){     
    const data = this.getUpdate();
    if (!data.password) {
        return next();
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
            return next(err)
        }
     bcrypt.hash(data.password,salt,(err,hash)=>{
         if(err){
             return next(err)
         }
         data.password = hash
         this.getUpdate({}, data);
         next()
     })

    })

})


userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;
    return new Promise((resolve,reject)=>{
        bcrypt.compare(candidatePassword,user.password,(err,isMatch)=>{
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

mongoose.model('User',userSchema);