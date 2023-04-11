const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
    deliveryDetails: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
    },
    userName:{
        type:String,
        required:true
    },
    paymentMethod: {
        type: String,
    },
    product: [
    {
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    }],
    totalAmount: {
        type: Number,
    },
    Date: {
        type: Date,
    },
    status: {
        type: String,
    },
    paymentId :{
        type : String
    }
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model("order", orderSchema);