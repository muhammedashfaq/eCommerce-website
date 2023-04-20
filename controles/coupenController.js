const User = require("../model/user_model");
const admin = require("../model/admin_model");
const CatDB = require("../model/category_Model");
const productdb = require("../model/prodect_model");
const user_address = require("../model/address_Model");
const productDB = require("../model/prodect_model");
const address_Model = require("../model/address_Model");
const coupon =require('../model/coupon_Mode')



const loadCoupon =async(req,res)=>{
    try {

        const coupons=await coupon.find({})
        res.render('coupon',{coupons})
    } catch (error) {
        console.log(error.message);
        
    }
}

//addloadCoupon

const addloadCoupon =async(req,res)=>{
    try {
        res.render('add_coupon')
    } catch (error) {
        console.log(error.message);
        
    }
}


const postaddcoupon =async(req,res)=>{
    try {

        const coupons = new coupon({

            code:req.body.code,
            discountType:req.body.discountType,
            discountAmount:req.body.amount,
            maxCartAmount:req.body.cartAmount,
            maxDiscountAmount:req.body.discountAmount,
            maxUsers:req.body.couponCount,
            expiryDate:req.body.date,


        })
        const couponData = await coupons.save()
        if(couponData){
            res.redirect('/admin/coupon')

        }else{
            res.redirect('/admin/coupon')


        }

        
    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    loadCoupon,
    addloadCoupon,
    postaddcoupon

}