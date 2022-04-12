const mongoCollections = require("../config/mongoCollections");
const UserData = mongoCollections.schoolData;
let { ObjectId } = require('mongodb');
var bcrypt = require('bcryptjs');


async function createUser(username, password,type,name){
    if(!username) throw "You must provide a username"
    if(!password) throw "You must provide a password"
    if(!type) throw "You must provide a user type"
    if(!name) throw "You must provide your name"
    if(typeof(username) !== 'string' || typeof(password) !== 'string' || typeof(type) !== 'string' || typeof(name) !== 'string') throw "Your input must be a string"
    if(username.trim().length ===0 || password.trim().length === 0 || name.trim().length ===0) throw "Your input can not be all space"
    if(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(username) || /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(name)) throw "Your username or name can not incude any special characters"
    if(/\s/.test(username) || /\s/.test(password)) throw "The information you provde incude space"
    if(username.length < 4) throw "Your username must have at least 4 characters"
    if(password.length <6) throw "Your password must be have at least 6 characters"
    let newUsername = username.toLocaleLowerCase();
    const saltRounds = 16;
    const hashPasswords = await bcrypt.hash(password, saltRounds);
    const Userinfo = await UserData();
    const checkUser = await Userinfo.findOne({ username: newUsername });
    if(checkUser !== null){
        return {userAlreadyexist: true}
    }

    let newUser = {
            username: newUsername,
            password: hashPasswords,
            userType:type,
            realName: name,
            bookingTime:[]
        }

    const output = await Userinfo.insertOne(newUser);
    if(output.insertedCount === 0) throw "Can not create the account"
    
    return {userInserted: true}


}

async function checkUser(username, password){
    if(!username) throw "You must provide a username"
    if(!password) throw "You must provide a password"
    if(typeof(username) !== 'string' || typeof(password) !== 'string') throw "Your input must be a string"
    if(username.trim().length ===0 || password.trim().length === 0) throw "Your input can not be all space"
    if(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(username)) throw "Your username can not incude any special characters"
    if(/\s/.test(username) || /\s/.test(password)) throw "The information you provde incude space"
    if(username.length < 4) throw "Your username must have at least 4 characters"
    if(password.length <6) throw "Your password must be have at least 6 characters"
    let newUsername = username.toLocaleLowerCase();
    let Userinfo = await UserData();
    const checkUser = await Userinfo.findOne({username:newUsername})
    
    if(checkUser === null){
        return {userNameFail: true}
    }
    const output = await bcrypt.compare(password, checkUser.password)
    if(output === true){
        return {authenticated: true, UserType: checkUser.userType, ID: checkUser._id}
    }else{
        return {authenticated: false}
    }
}

async function findUser(id){
    if(!id) throw "you must provde an ID"
    if(typeof(id) !== "string") throw "ID must be an string"
    if(id.trim().length === 0) throw "Your ID can not be all space"
    let userInfo = await UserData(); 
    const checkUser = await userInfo.findOne({ _id: ObjectId(id) });
    if(checkUser === null) throw "Can not find this ID"
    checkUser._id = checkUser._id.toString()
    return checkUser
    
}


module.exports = {
    createUser,
    checkUser,
    findUser
}