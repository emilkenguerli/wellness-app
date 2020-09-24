const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')

const app = express()
const PORT = 9000
const {mogoUrl, EMAIL_SECRET} = require('./keys')
const jwt = require('jsonwebtoken')

// var config = {
//     username:'kngemi002',
//     Password:'SohYiu7a',
//     host:'sws-1.cs.uct.ac.za',
//     port:22,
//     dstPort:PORT,
// };

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


// var server = tunnel(config, function (error, server) {
//     if(error){
//         console.log("SSH connection error: " + error);
//     }
//     mongoose.connect(mogoUrl,{
//         useNewUrlParser:true,
//         useUnifiedTopology:true
//     })

//     var db = mongoose.connection;
//     db.on('error', console.error.bind(console, 'DB connection error:'));
//     db.on('connected', function() {
//         // we're connected!
//         console.log("DB connection successful");
//         // console.log(server);
//     });

//     app.use(authRoutes)
// });

// server.on('error', function(err){
//     console.error('Something bad happened:', err);
// });


mongoose.connect(mogoUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB")
})

mongoose.connection.on('error',(err)=>{
    console.log("this is error",err)
})

app.get('/',requireToken,(req,res)=>{
    res.send({email:req.user.email})
})

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

app.listen(PORT,()=>{
    console.log("Server running on port: "+PORT)
})
