"""
NOTES:
    we have two users: advisor and student
    
    keep storing the bookings into the database - advisor level
        everythign will be like  int = 0, strings = ""
        attribute called availability
            -student booking times has seperate document - time 
        
    students perspective 
        editting or updating those bookings
        int = #, strings = name
        
    Advisor:
        Name: Nina
        Type: advisor
        
        -> edit in between to add to data base as an array -> input start to end 
        
        ARRAY:
             
            boolean: true/false to determine open booking or not
            Name: "HART"
            EMAIL ADDRESS:""
            COMMENTS: ""
            
            boolean: true/false to determine open booking or not
            Name: "HART"
            EMAIL ADDRESS:""
            COMMENTS: ""
        
        Name: joe smoe
        Type:
      

        ARRAY:

            
            I       (start time - end time)/ 30 -> loop to create all the bookings
            V  
             
            boolean: true/false to determine open booking or not
            Name: "HART"
            EMAIL ADDRESS:""
            COMMENTS: ""
            
            boolean: true/false to determine open booking or not
            Name: "HART"
            EMAIL ADDRESS:""
            COMMENTS: ""
             
"""

from email.errors import FirstHeaderLineIsContinuationDefect
from socket import NI_NAMEREQD
from cv2 import QT_RADIOBOX
import pymongo
from pymongo import MongoClient


cluster = MongoClient("mongodb+srv://vibranthart:HEART174@cluster0.nuwjb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

#acess cluster -> access collection in cluster
db = cluster["SSW-540"]
collection = db["Project"]

#x = [1,2,3]

#post1 = {"_id":0,"name":"","type":"","array": x}
#collection.insert_one(post1)

#asks for user input of file name and locates the file and transfer data into variable file
#userinput = input('Name')
#y = ""
#results = collection.find({"name":y})
#for result in results:
    
    #print(result["array"][2])
    #for element in result["array"]:
    #    print(element)
    
#array = []
#dictbooking = dict()
#dictbooking["name"] = "Nina"
#dictbooking["number"] = 21

#dictbooking2 = dict()
#dictbooking2["name"] = "Hart"
#dictbooking2["number"] = 30

#array.append(dictbooking)
#array.append(dictbooking)

def viewAvailability(userinput):
    
    persons = collection.find({"name":userinput})
    for person in persons:
        print("Advisor: ", person["name"])
        for element in person["array"]:
            
            print(element)

######################## - ADMIN FUNCTIONS - #################################

def adminCreateProfile():
    print("Create Admin Profile")
    print()
    
    array = []
    
    name = input('Enter Name: ')
    type = input('Enter Role: ')
     
   
        
    post = {"name":name, "type":type, "array": array}
    
    collection.insert_one(post)
    
def adminAddBooking():
    print("Admin Add Booking")
    print()
    
    temparray = []
    
    userinput = input("Enter Advisor: ")
    persons = collection.find({"name":userinput})
    for person in persons:
       
        temparray = person["array"]
        
        #temporary
        hours = int(input('Time (hrs): ') )
        
        minute = hours * 60;
        cfloop = int(minute/30);
        
        time = 0;
        for i in range(cfloop):
            dictbooking = dict()
            dictbooking["time"] = time
            dictbooking["bool"] = False
            dictbooking["name"] = ""
            dictbooking["emailid"] = ""
            dictbooking["comment"] = ""
            temparray.append(dictbooking)
            time = time + 30
            
    collection.update_one({"name":userinput}, {"$set":{"array":temparray}})
        
    
def adminDeleteBooking():
    print("Admin Delete Booking")
    print()
    
    #pop the booking
    temparray = []
    
    userinput = input("Enter Advisor: ")
    userinput1 = int(input("Enter Time: "))
    
    persons = collection.find({"name":userinput})
    for person in persons:
       
        temparray = person["array"]
        
        for spot in temparray:
            if spot["time"] == userinput1:
                temparray.remove(spot)
                
    
    collection.update_one({"name":userinput}, {"$set":{"array":temparray}})    
        
        
       
######################## - STUDENT FUNCTIONS - #################################

def acceptBooking():
    print("Accept Booking")
    print()
    
    userinput = input('Enter Advisor: ')
    viewAvailability(userinput)
    time = int(input('What Time Slot: '))
    userinput1 = input('Your Name: ')
    userinput2 = input('Your Email ID: ')
    userinput3 = input('Comment: ')
    
    temparray = []
    
    persons = collection.find({"name":userinput})
    for person in persons:
        print("Advisor: ", person["name"])
        temparray = person["array"]
        for spot in temparray:
            #spot["time"] = spot["time"] + 1
            #print(type(spot["time"]))
            
            if spot["time"] == time:
                #print(spot)
                #print("hello")
                spot["name"] = userinput1
                spot["emailid"] = userinput2
                spot["comment"] = userinput3
                spot["bool"] = True
                
            print(spot)
    #print(temparray)
    
    collection.update_one({"name":userinput}, {"$set":{"array":temparray}})
    
def cancelBooking():
    print("Cancel Booking")
    print()
    
    #pop the booking
    temparray = []
    
    userinput = input("Enter Advisor: ")
    userinput1 = int(input("Enter Time: "))
    userinput2 = input("Your Name: ")
    
    persons = collection.find({"name":userinput})
    for person in persons:
       
        temparray = person["array"]
        
        for spot in temparray:
            if spot["time"] == userinput1 and spot["name"] == userinput2:
                spot["name"] = ""
                spot["emailid"] = ""
                spot["comment"] = ""
                spot["bool"] = False
    
        
    collection.update_one({"name":userinput}, {"$set":{"array":temparray}})     

    


#viewAvailability()
#adminCreateProfile()
#adminAddBooking()
#adminDeleteBooking()
#acceptBooking()
#cancelBooking()
    
    
