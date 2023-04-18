 const mongoose =require('mongoose')

 let dotenv = require('dotenv')
 dotenv.config()

 module.exports={

    mongoDB:()=>{

        mongoose.connect(process.env.mongo_url,{
            
        }).then(()=>{
            console.log("database connected");
        }).catch((err)=>{
            console.log(err);
        })
    }

 }
 