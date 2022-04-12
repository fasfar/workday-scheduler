const express = require('express');
const router = express.Router();
const data = require('../Data/users');
const orderData = require('../Data/Booking');


router.get('/', async(req,res) =>{
    if(!req.session.user){
        res.render('webs/login', {Lgoin: false, name:"Lgoin-in"})
    }
    else{
        res.redirect('/private')
    }
});

router.get('/signup', async(req,res) =>{
    if(!req.session.user){
        res.render('webs/signup', {Lgoin: false, name:"sign-up"})
    }
    else{
        res.redirect('/private')
    }
});

router.post('/signup', async(req,res) =>{
    username = req.body.Username;
    password = req.body.password;
    type = req.body.type;
    acutal_name = req.body.real_name;

    if(!username){
        res.status(400).render('webs/signup', {userNameNotProvide: true, name:"Error"})
        return;
    }
    if(!password){
        res.status(400).render('webs/signup', {passWordsNotProvide: true, name:"Error"})
        return;
    }
    if(!type){
        res.status(400).render('webs/signup', {TypeNotProvide: true, name:"Error"})
        return;
    }
    if(!acutal_name){
        res.status(400).render('webs/signup', {NameNotProvide: true, name:"Error"})
        return;
    }
    if(typeof(username) !== 'string'){
        res.status(400).render('webs/signup', {userNameNotString: true, name:"Error"})
        return;
    }
    if(typeof(password) !== 'string'){
        res.status(400).render('webs/signup', {passWordsNotString: true, name:"Error"})
        return;
    }
    if(typeof(type) !== 'string'){
        res.status(400).render('webs/signup', {typeNotString: true, name:"Error"})
        return;
    }
    if(typeof(acutal_name) !== 'string'){
        res.status(400).render('webs/signup', {acutalNameNotString: true, name:"Error"})
        return;
    }
    if(username.trim().length ===0){
        res.status(400).render('webs/signup', {AllSpacesU: true, name:"Error"})
        return;
    }
    if(password.trim().length ===0){
        res.status(400).render('webs/signup', {AllSpacesP: true, name:"Error"})
        return;
    }
    if(acutal_name.trim().length ===0){
        res.status(400).render('webs/signup', {AllSpacesN: true, name:"Error"})
        return;
    }
    if(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(username) || /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(acutal_name)){
        res.status(400).render('webs/signup', {specialCharaUserName: true, name:"Error"})
        return;
    }

    if(/\s/.test(username) || /\s/.test(password)){
        res.status(400).render('webs/signup', {spaceInInput: true, name:"Error"})
        return;        
    }

    if(username.length < 4){
        res.status(400).render('webs/signup', {UsernameLessfour: true, name:"Error"})
        return;        
    }

    if(password.length <6){
        res.status(400).render('webs/signup', {passwordLessSix: true, name:"Error"})
        return;    
    }

    try{
        const searchInfo = await data.createUser(username, password,type,acutal_name)
        if(searchInfo === null){
            res.status(500).render('webs/signup', {serverError: true, name:"Error"})

        }
        if(searchInfo.userAlreadyexist === true){
            res.status(400).render('webs/signup', {alreadyExist: true, name:"Error"})
        }
        if(searchInfo.userInserted === true){
            res.redirect('/')
        }
    }catch(e){
        res.status(400).json({ error: e });
    }
});

router.post('/login', async(req,res) =>{
    username = req.body.UsernameL
    password = req.body.passwordL

    if(!username){
        res.status(400).render('webs/login', {userNameNotProvide: true, name:"Error"})
        return;
    }
    if(!password){
        res.status(400).render('webs/login', {passWordsNotProvide: true, name:"Error"})
        return;
    }

    if(typeof(username) !== 'string'){
        res.status(400).render('webs/login', {userNameNotString: true, name:"Error"})
        return;
    }

    if(typeof(password) !== 'string'){
        res.status(400).render('webs/login', {passWordsNotString: true, name:"Error"})
        return;
    }

    if(username.trim().length ===0){
        res.status(400).render('webs/login', {AllSpacesU: true, name:"Error"})
        return;
    }

    if(password.trim().length ===0){
        res.status(400).render('webs/login', {AllSpacesP: true, name:"Error"})
        return;
    }
    if(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(username)){
        res.status(400).render('webs/login', {specialCharaUserName: true, name:"Error"})
        return;
    }

    if(/\s/.test(username) || /\s/.test(password)){
        res.status(400).render('webs/login', {spaceInInput: true, name:"Error"})
        return;        
    }

    if(username.length < 4){
        res.status(400).render('webs/login', {UsernameLessfour: true, name:"Error"})
        return;        
    }

    if(password.length <6){
        res.status(400).render('webs/login', {passwordLessSix: true, name:"Error"})
        return;    
    }

    try{
        const searchInfo = await data.checkUser(username, password)
        if(searchInfo.userNameFail === true){
            res.status(400).render('webs/login', {userNameFail: true, name:"Log-in"})
        }
        if(searchInfo.authenticated === true){
            req.session.userId = searchInfo.ID;
            req.session.user = {Name:username};
            req.session.type = searchInfo.UserType;
            res.redirect('/private');
        }else{
            res.status(400).render('webs/login', {Checkfail: true, name:"Log-in"})
        }
    }catch(e){
        res.status(400).json({ error: e });
    }
});


router.get('/private', async(req,res) =>{
    let newId = req.session.userId
    try{
        const advisorList = await orderData.findAllAdvisor();
        const personInfo = await data.findUser(newId);
        let orderList = personInfo.bookingTime;
        if(req.session.type === "Student"){
            console.log(advisorList)
            res.render('webs/private', {Login: true, name : "Private"  ,user: req.session.user.Name, userIsStudent: true, Advisors: advisorList, orderInfor: orderList})
        }
        if(req.session.type === "Advisor"){
            res.render('webs/private', {Login: true, name : "Private"  ,user: req.session.user.Name, orderInfor: orderList})
        }
    }catch(e){
        console.log(e)
    }
});


router.get('/logout', async(req,res) =>{
    req.session.destroy()
    res.render('webs/logout', {name: "Logout"})

});

module.exports = router;
