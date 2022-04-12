const mongoCollections = require("../config/mongoCollections");
const schoolDataSet = mongoCollections.schoolData;
let { ObjectId } = require('mongodb');
const { compareSync } = require("bcryptjs");

async function createOfficeHour(advioserId, studentId, date, time){

    if(!advioserId) throw "[Booking data Error]:You need to provide the advioser ID"
    if(!studentId) throw "[Booking data Error]:You need to provide the student ID"
    if(!date) throw "[Booking data Error]: You need to provide a date"
    if(!time) throw "Booking data Error]: You need to provide a time"

    if(typeof(advioserId) !== 'string') throw "[Booking data Error]: The gymId need to be a string"
    if(typeof(studentId) !== 'string') throw "[Booking data Error]: The userId need to be a string"
    if(typeof(date) !== 'string') throw "[Booking data Error]: The date need to be a string"
    if(typeof(time) !== 'string') throw "[Booking data Error]: The time need to be a string"


    if(advioserId.trim().length ===0 ) throw "[Booking data Error]: The gym Id can not be all white space"
    if(studentId.trim().length ===0 ) throw "[Booking data Error]: The user Id can not be all white space"
    if(date.trim().length ===0 ) throw "[Booking data Error]: The date can not be all white space"
    if(time.trim().length ===0 ) throw "[Booking data Error]: The time can not be all white space"


    if (!ObjectId.isValid(advioserId)) throw "[Booking data Error]:the invalid gym ObjectId"
    if (!ObjectId.isValid(studentId)) throw "[Booking data Error]:the invalid user ObjectId"

    if(date.length !== 10) throw "[Booking data Error]: The date is not a vaild date"

    if(date.substring(2,3) !== "/" && date.substring(5,6) !== "/" ) throw "[Booking data Error]:The date is not a vaild date"

    if(isNaN(+date.substring(0,2)) || isNaN(+date.substring(3,5))|| isNaN(+date.substring(6,10))) throw "[Booking data Error]: The date is not a vaild date"

    if(date.substring(0,2).trim().length === 0 ||date.substring(3,5).trim().length === 0|| date.substring(6,10).trim().length === 0 ) throw "[Booking data Error]:The date include space"

    if(parseInt(date.substring(0,2)) > 12 || parseInt(date.substring(0,2)) < 0) throw "[Booking data Error]: The input date is not a vaild month" 
    
    if(parseInt(date.substring(3,5)) > 31 || parseInt(date.substring(0,2)) < 0) throw "[Booking data Error]: The input date is not a vaild day" 

    if(parseInt(date.substring(0,2)) === 2 && parseInt(date.substring(3,5)) > 28 ) throw "[Booking data Error]: The input date is not a vaild day "

    if(parseInt(date.substring(0,2)) === 4 && parseInt(date.substring(3,5)) > 30 ) throw " [Booking data Error]: The input date is not a vaild day "

    if(parseInt(date.substring(0,2)) === 6 && parseInt(date.substring(3,5)) > 30 ) throw " [Booking data Error]: The input date is not a vaild day "

    if(parseInt(date.substring(0,2)) === 9 && parseInt(date.substring(3,5)) > 30 ) throw "[Booking data Error]:  The input date is not a vaild day "

    if(parseInt(date.substring(0,2)) === 11 && parseInt(date.substring(3,5)) > 30 ) throw "[Booking data Error]:  The input date is not a vaild day "
    
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();


    if(time.length !== 5) throw "[Booking data Error]: The time is not a valid time."
    if(isNaN(+time.substring(0,2)) || isNaN(+time.substring(3,5))) throw "[Booking data Error]: The time is not a valid time."
    if(parseInt(time.substring(0,2)) > 18 || parseInt(time.substring(0,2)) < 9 ) throw "[Booking data Error]: The time is not a valid time."
    if(parseInt(time.substring(3,5)) !== 00)throw "[Booking data Error]: The time is not a valid time."


    today = mm + '/' + dd + '/' + yyyy; 
    if(Date.parse(date) < Date.parse(today)) throw "[Booking data Error]: The date of review must after current date"

    const orderData = await schoolDataSet();
    const searchAdvisor = await orderData.findOne({ _id: ObjectId(advioserId) });
    const searchStudent = await orderData.findOne({_id:ObjectId(studentId)});
    if(searchAdvisor === null) throw "no advisor found"
    if(searchStudent === null) throw "no student found"
    let newOrder = {
        OrderId:ObjectId(),
        advioser: advioserId,
        Name:searchStudent.realName,
        StudentId: studentId,
        date: date,
        time:time
    }
    const addBookingToAdvisor  = await orderData.updateOne(
        {_id:ObjectId(advioserId)},
        {$addToSet:{ bookingTime: newOrder}}
    )
    if (!addBookingToAdvisor.matchedCount && !addBookingToAdvisor.modifiedCount)throw 'Create failed';

    let newOrder2 = {
        OrderId:ObjectId(),
        advioser: advioserId,
        Name:searchAdvisor.realName,
        StudentId: studentId,
        date: date,
        time:time
    }

    const addBookingToStudent = await orderData.updateOne(
        {_id:ObjectId(studentId)},
        {$addToSet:{ bookingTime: newOrder2}}
    )

    if (!addBookingToStudent.matchedCount && !addBookingToStudent.modifiedCount)throw 'Create failed';
    return {addNewOrder: true}
}

async function findAllAdvisor(){
    const schoolCollection = await schoolDataSet();
    const output = await schoolCollection.find({userType: "Advisor"}).toArray();
    for (let i = 0; i < output.length; i++) {
        output[i]._id = output[i]._id.toString();
    }
    return output;
}

async function getOrders(Id){
    if (!Id) throw '[Booking Id Error]: Id parameter must be supplied';

    if (typeof Id !== 'string') throw "[Booking Id Error]: Id must be a string";

    if (Id.trim().length === 0) throw "[Booking Id Error]: the id include all space"

    if (!ObjectId.isValid(Id)) throw "[Booking Id Error]: the invalid ObjectId"

    const dataCollection = await schoolDataSet();
    const theOrder = await dataCollection.findOne({bookingTime:{ $elemMatch: {_id : ObjectId(reviewId)}}});    

    if(!theOrder) throw "Can not find Booking information by this ID"
    let output;
    for(let i = 0; i < theOrder.bookingTime.length; i++){
        if(theOrder.bookingTime[i]._id.toString() === reviewId){
            output = theOrder.bookingTime[i];
        }
    }
    output._id = output._id.toString()
    return output

}


module.exports = {
    createOfficeHour,
    getOrders,
    findAllAdvisor
}