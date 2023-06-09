const mongoose=require('mongoose')



const useraddressSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true,
    },

    address:[{
    fname:{
        type:String,
        required:true,
        trim:true
    },
    sname:{
        type:String,
        required:true,
        trim:true
    },
    mobile:{
        type:Number,
        required:true,
        trim:true
    },
    
    email:{
        type:String,
        required:true,
        trim:true,
    },
    address:{
        type:String,
        required:true,
        trim:true
        

    },
    
    pin:{
        type:String,
        required:true,
        trim:true
    },
}]




})


module.exports=mongoose.model('user_address',useraddressSchema)