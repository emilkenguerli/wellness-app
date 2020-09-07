const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const tunnel = require('tunnel-ssh')

const app = express()
const PORT = 9000
const {mogoUrl} = require('./keys')

var config = {
    username:'kngemi002',
    Password:'SohYiu7a',
    host:'sws-1.cs.uct.ac.za',
    port:22,
    dstPort:PORT,
  };

require('./models/Student');
require('./models/Booking');

const requireToken = require('./middleware/requireToken')
const authRoutes = require('./routes/authRoutes')
app.use(bodyParser.json())
app.use(authRoutes)

var server = tunnel(config, function (error, server) {
    if(error){
        console.log("SSH connection error: " + error);
    }
    mongoose.connect(mogoUrl,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'DB connection error:'));
    db.once('open', function() {
        // we're connected!
        console.log("DB connection successful");
        // console.log(server);
    });
});

server.on('error', function(err){
    console.error('Something bad happened:', err);
});

// mongoose.connect(mogoUrl,{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// })

// mongoose.connection.on('connected',()=>{
//     console.log("connected to mongo")
// })

// mongoose.connection.on('error',(err)=>{
//     console.log("this is error",err)
// })

app.get('/',requireToken,(req,res)=>{
    res.send({email:req.student.email})
})

const bookingsRouter = require('./routes/bookings');
app.use('/bookings', bookingsRouter)

app.listen(PORT,()=>{
    console.log("server running "+PORT)
})
