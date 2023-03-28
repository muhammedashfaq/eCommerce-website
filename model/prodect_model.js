const mongoose =require('mongoose')

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    price:{
        trype:Number,
        required:true
    },
    description:{
        type:String,
        required:true

    },
    image:{
        type:Array
    },
    categody:{
        type:String,
        required:true

    },
    stock:{
        type:String,
        required:true
    },
    qnty:{
        type:Number,
        required:true``
    },
    blocked :{
        type : Boolean,
        default : false
    }
},
{
    timestamps: true
})



module.exports=mongoose.model('produst',productSchema)