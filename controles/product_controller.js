const User= require("../model/user_model")
const admin=require('../model/admin_model')
const CatDB=require('../model/category_Model')
const productdb=require('../model/prodect_model')


const productload = async (req,res)=>{
    try {
        const data = await productdb.find()

        res.render('products',{product:data})
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


const insertProduct = async (req,res)=>{
    try {

        const Data = new productdb({

            name:req.body.name,
            price:req.body.price,
            category:req.body.category,
            stock:req.body.stock,
            quantity:req.body.quantity,
            description:req.body.description,

            image:req.file.filename,

            blocked:false

        })
        const productdata =await Data.save()

        if(productdata){

            res.redirect('/admin/products')
        }else{
            res.render('add_products',{message:"error"})


        }





        
    } catch (error) {
        console.log(error.message);
        
    }

}

module.exports={

    productload,
    addProductload,
    insertProduct

}