const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')

const app = express()
const PORT = 9000
const {mogoUrl, EMAIL_SECRET} = require('./keys')
const jwt = require('jsonwebtoken')

// create reusable transporter object using the default SMTP transport

require('./models/User');
require('./models/Booking');
require('./models/Article');
require('./models/Event');

const requireToken = require('./middleware/requireToken')
const authRoutes = require('./routes/authRoutes')
const User = mongoose.model('User')
app.use(bodyParser.json())
app.use(authRoutes)

/**
 * Connect to the MongoDB database specified in keys.js
 */

mongoose.connect(mogoUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

/**
 * Verify that the connection was successful
 */

mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB")
})

/**
 * Throw an error if the connection was not successful
 */

mongoose.connection.on('error',(err)=>{
    console.log("this is error",err)
})

/**
 * Route a request to the middleware to see if its token is verified and the action can proceed
 */

app.get('/',requireToken,(req,res)=>{
    res.send({email:req.user.email})
})

/**
 * When the user presses the link in the email confirmation email, the JSON request will be
 * routed here and if tne token is verified and hasn't expired, a query will be made to
 * the database to update the email confirmation field to true of the user who's email address 
 * matches the one in the address. 
 */

app.get('/confirmation/:token', async (req, res) => {
    try {
        jwt.verify(req.params.token,EMAIL_SECRET,async (err,payload)=>{
            if(err){
              res.status(401).send({error:"Link has expired"})
            }
         const {userId} = payload;
         const user = await User.findById(userId)
         await user.update({ confirmed: true });
        })
    } catch (e) {
      res.send(e);
    }
    res.send("Email confirmed, registration completed!")
});

const bookingsRouter = require('./routes/bookings');
app.use('/bookings', bookingsRouter)

const articlesRouter = require('./routes/articles');
app.use('/articles', articlesRouter)

const eventsRouter = require('./routes/events');
app.use('/events', eventsRouter)

/**
 * Verfies which port the server is currently running on
 */

app.listen(PORT,()=>{
    console.log("Server running on port: "+PORT)
})
