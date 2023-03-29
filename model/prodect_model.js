const mongoose =require('mongoose')

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true

    },

    image:{
        type:Array
    },
    category:{
        type:String,
        required:true

    },
    stock:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    blocked :{
        type : Boolean,
        default : false
    }

},
{
    timestamps: true
})



module.exports=mongoose.model('product',productSchema)




