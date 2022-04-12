const express = require('express');
const router = express.Router();
const bookingData = require('../data/Booking');

router.get('/booking/:id', async(req,res) =>{
    if(req.session.user){
    res.render('webs/officeHourOrder',{title: "Make an appointment", userId: req.params })
      }
      else{
        loggedin = false
        res.redirect('/login')

    }
    
});

router.post('/booking/:id', async (req, res) => {

    orderDate = req.body.date
    orderTime = req.body.time
    advioserId = req.params.id
    studentId = req.session.userId


    const makeBooking = await bookingData.createOfficeHour(advioserId, studentId, orderDate, orderTime);
    if(makeBooking.addNewOrder === true){
        res.render('webs/successBooked', {title: "Successful"})
    }else{
        res.status(400).render('webs/booking', {editeFail: true})
    }
    
});



router.get('/officeHourOrder', async(req,res) =>{
    if(req.session.user){
    res.render('webs/officeHourOrder',{title: "Successful" })
      }
      else{
        loggedin = false
        res.redirect('/login')

    }
    
});



module.exports = router;
