const express = require('express');
const router = express.Router();
const bookingData = require('../data/Booking');
const userData = require('../data/users')

router.get('/booking/:id', async(req,res) =>{
    if(req.session.user){
    const BookList = await userData.findUser(req.params.id);
    res.render('webs/officeHourOrder',{title: "Make an appointment", userId: req.params, BookedList: BookList.bookingTime })
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
    if(! orderDate || ! orderTime || !advioserId || !studentId){
        res.status(400).render('webs/officeHourOrder', {MissingInfo: true})
        return;
    }

    if(typeof(orderDate) !=='string' || typeof(orderTime) !=='string' || typeof(advioserId) !=='string' || typeof(studentId) !=='string'){
        res.status(400).render('webs/officeHourOrder', {NotString: true})
        return;
    }

    if(orderDate.trim().length === 0 || orderTime.trim().length ===0 || advioserId.trim().length === 0|| studentId.trim().length === 0){
        res.status(400).render('webs/officeHourOrder', {AllSpace: true})
        return;
    }

    if(parseInt(orderDate.substring(0,2)) > 12 || parseInt(orderDate.substring(0,2)) < 0){
        res.status(400).render('webs/officeHourOrder', {InvalidDate: true})
        return;
    }
    if(parseInt(orderDate.substring(3,5)) > 31 || parseInt(orderDate.substring(0,2)) < 0){
        res.status(400).render('webs/officeHourOrder', {InvalidDate: true})
        return;
    }
    if(parseInt(orderDate.substring(0,2)) === 2 && parseInt(orderDate.substring(3,5)) > 28 ){
        res.status(400).render('webs/officeHourOrder', {InvalidDate: true})
        return;
    }
    if(parseInt(orderDate.substring(0,2)) === 4 && parseInt(orderDate.substring(3,5)) > 30){
        res.status(400).render('webs/officeHourOrder', {InvalidDate: true})
        return;
    }
    if(parseInt(orderDate.substring(0,2)) === 6 && parseInt(orderDate.substring(3,5)) > 30 ){
        res.status(400).render('webs/officeHourOrder', {InvalidDate: true})
        return;
    }
    if(parseInt(orderDate.substring(0,2)) === 9 && parseInt(orderDate.substring(3,5)) > 30 ){
        res.status(400).render('webs/officeHourOrder', {InvalidDate: true})
        return;
    }
    if(parseInt(orderDate.substring(0,2)) === 11 && parseInt(orderDate.substring(3,5)) > 30 ){
        res.status(400).render('webs/officeHourOrder', {InvalidDate: true})
        return;
    }

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy; 

    if(orderTime.length !== 5){
        res.status(400).render('webs/officeHourOrder', {InvalidTime: true})
        return;
    }
    if(isNaN(+orderTime.substring(0,2)) || isNaN(+orderTime.substring(3,5))){
        res.status(400).render('webs/officeHourOrder', {InvalidTime: true})
        return;
    }
    if(parseInt(orderTime.substring(0,2)) > 18 || parseInt(orderTime.substring(0,2)) < 9 ){
        res.status(400).render('webs/officeHourOrder', {InvalidTime: true})
        return;
    }
    if(parseInt(orderTime.substring(3,5)) !== 00){
        res.status(400).render('webs/officeHourOrder', {InvalidTime: true})
        return;
    }
    if(Date.parse(orderDate) < Date.parse(today)){
        res.status(400).render('webs/officeHourOrder', {InvalidDate: true})
        return;
    }

    const makeBooking = await bookingData.createOfficeHour(advioserId, studentId, orderDate, orderTime);
    if(makeBooking.Booked === true){
        res.status(400).render('webs/officeHourOrder', {Booked: true})
    }
    if(makeBooking.addNewOrder === true){
        res.render('webs/successBooked', {title: "Successful"})
    }else{
        res.status(400).render('webs/officeHourOrder', {editeFail: true})
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
