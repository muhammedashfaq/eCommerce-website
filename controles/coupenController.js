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


const applyCoupon = async(req,res)=>{
    try{
        const code = req.body.code;
        const amount = Number(req.body.amount);
        const userExist = await coupon.findOne({code:code,user:{$in:[req.session.user_id]}});
        if(userExist){
            res.json({user:true});
        }else{
            const couponData = await coupon.findOne({code:code});
            console.log(couponData);
            if(couponData){
                if(couponData.maxUsers<=0){
                    res.json({limit:true});
                }else{
                    if(couponData.status == false){
                        res.json({status:true})
                    }else{
                        if(couponData.expiryDate<=new Date()){
                            res.json({date:true});
                        }else{
                            if(couponData.maxCartAmount >= amount){
                                res.json({cartAmount:true});
                            }else{
                                await coupon.findByIdAndUpdate({_id:couponData._id},{$push:{user:req.session.user_id}});
                                await coupon.findByIdAndUpdate({_id:couponData._id},{$inc:{maxUsers:-1}});
                                if(couponData.discountType == "Fixed"){
                                    const disAmount = couponData.discountAmount;
                                    const disTotal = Math.round(amount - disAmount);
                                    return res.json({amountOkey:true,disAmount,disTotal});
                                }else if(couponData.discountType == "Percentage Type"){
                                    const perAmount = (amount * couponData.discountAmount)/100;
                                    if(perAmount <= maxDiscountAmount){
                                        const disAmount = perAmount;
                                        const disTotal = Math.round(amount-disAmount);
                                        return res.json({amountOkey:true,disAmount,disTotal});
                                    }
                                }else{
                                    const disAmount = couponData.maxDiscountAmount;
                                    const disTotal = Math.round(amount-disAmount);
                                    return res.json({amountOkey:true,disAmount,disTotal});
                                }
                            }
                        }
                    }
                }
            }else{
                res.json({invalid:true});
            }
        }

    }catch(error){
        console.log(error.message);
    }
}

module.exports={
    loadCoupon,
    addloadCoupon,
    postaddcoupon,
    applyCoupon

}