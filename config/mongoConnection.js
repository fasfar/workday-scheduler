const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://User1:1234567AB@cluster0.lqlde.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
let client = undefined
let db = undefined



async function main(){
  
  try{
    await client.connect()
    console.log('Database Connected successfully')
  }catch(e){
    console.log(`Error : ${e}`)
  }finally{
    await client.close()
  }

}
// main().catch(console.error)
module.exports = {
    connectToDb: async () => {
        if( ! client ){
            try{
                client = await MongoClient.connect(uri)
                db = await client.db('540DataBase')
            }catch(e){
                console.log(`Error : ${e}`)
            }
            
        }
        return db
    },
    closeConnection: () => {
        client.close()
    }
}