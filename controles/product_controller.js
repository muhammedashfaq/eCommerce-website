const User= require("../model/user_model")
const admin=require('../model/admin_model')
const CatDB=require('../model/category_Model')


const productload = async (req,res)=>{
    try {
        res.render('products')
    } catch (error) {
        console.log(error.message);
        
    }
}


const addProductload = async (req,res)=>{
    try {
        res.render('add_products')
    } catch (error) {
        console.log(error.message);
        
    }
}


const insertProduct =async (req,res)=>{
    try {
        
    } catch (error) {
        console.log(error.message);
        
    }

}

module.exports={

    productload,
    addProductload,
    insertProduct

}