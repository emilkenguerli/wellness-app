const router = require('express').Router();
const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');

router.route('/').get((req, res) => {
  Booking.find()
    .then(bookings => res.json(bookings))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/add',async (req,res)=>{
  const {staffId, team, service, start, end, note, student, canceled, dna} = req.body;
  try{
    const booking = new Booking({staffId, team, service, start, end, note, student, canceled, dna});
    console.log(booking);
    await  booking.save(function(err){
      if(err){
           console.log(err);
           return;
      }
    });
    res.send({booking})

  }catch(err){
    return res.status(422).send(err.message)
  }
  
  
})

router.post('/remove',async (req,res)=>{
  const {id} = req.body;
  console.log(id);
  try{
    await  Booking.deleteOne({ _id: id }, function (err) {
      if(err) console.log(err);
      console.log("Successful deletion");
    });
    
    //res.send({booking})

  }catch(err){
    return res.status(422).send(err.message)
  }
  
  
})

module.exports = router;