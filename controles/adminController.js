const User= require("../model/user_model")
const admin=require('../model/admin_model')
const CatDB=require('../model/category_Model')
const order =require('../model/order_Model')
const productDB = require('../model/prodect_model')




const bcrypt =require('bcrypt')


const securePassword=async(password)=>{
    try {
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
        
    }}

const getLogin=async (req,res)=>{
    try {
            res.render('login')

    } catch (error) {
        console.log(error.message);
        
    }
}

const veryfiLogin=async (req,res)=>{
    try {
        
        const email=req.body.email;
        const password= req.body.password

        const adminData=await admin.findOne({email:email})


        if(adminData){
            if(password==adminData.password){

                req.session.admin_id=adminData._id;

               
                res.redirect('/admin/home')
            }else{
                res.render('login')
            }
        }else{
            res.render('login')


        }

    } catch (error) {
        console.log(error.message);
        
    }
}



const getHome=async (req,res)=>{
    try {
       
            const userData = await User.find({is_admin:0,is_verified:0});
            const Total = await order.aggregate([{$group:{_id:null,totalAmount:{$sum:"$totalAmount"}}}])
            const Users = await User.find({is_admin:0}).count();
            const Orders = await order.find({}).count();
            const Products = await productDB.find({}).count();
           // const total = total[0].total;
            const onlineCount = await order.aggregate([{$group:{_id:"$paymentMethod",totalPayment:{$count:{}}}}])

            console.log(onlineCount);
            console.log(Total);
           console.log(Products);
           console.log(Users);
          

        res.render('home',{userData,Users,Orders,Products,Total,onlineCount})
        
    } catch (error) {
        console.log(error.message,);
        
    }
}

const logout =async(req,res)=>{
    try {
        
        req.session.admin_id = false
        res.redirect('/admin')

        
    } catch (error) {
        console.log(error.message);
        
    }
}

const getTable = async(req,res)=>{
    try {

        const userData =await User.find({is_admin:0})
        
        res.render('user_details',{data:userData})
    } catch (error) {
        console.log(error.message);
        
    }
}




const veryfiUser = async(req,res)=>{
    try {
        const id=req.query.id

     const userData=   await User.findById({_id:id})
        if(userData.is_verified==0){
            await User.updateOne({_id:id},{$set:{is_verified:1}})
            res.redirect('/admin/user_details')
        }if(userData.is_verified==1){
            await User.updateOne({_id:id},{$set:{is_verified:0}})
            res.redirect('/admin/user_details')
        }



    } catch (error) {

        console.log(error.message);
        
    }


}

const blockUser =async (req,res)=>{
    try {
        const id=req.query.id

        const userData =await User.findById({_id:id})

        if(userData.is_blocked==true){
            await User.updateOne({_id:id},{$set:{is_blocked:false}})
            res.redirect('/admin/user_details')

        }if(userData.is_blocked==false){
            await User.updateOne({_id:id},{$set:{is_blocked:true}})
            res.redirect('/admin/user_details')
        }
        
    } catch (error) {
        console.log(error.message);
        
    }
}





const deleteUser= async (req,res)=>{
    
    try {

        const id=req.query.id
        await User.deleteOne({_id:id})
        res.redirect('/admin/user_details')
        
    } catch (error) {
        console.log(error.message)        
    }
}


const categoryLoad = async (req,res)=>{
    try {
        const categryDetails =await CatDB.find()

        res.render('category',{catData:categryDetails})
    } catch (error) {
        console.log(error.message);
        
    }
}

const insert_category =async (req,res)=>{
    try {
        const name=req.body.name;

        if(name.trim().length==0){
            res.redirect('/admin/category')
        }else{

      

        const alredy = await CatDB.findOne({name: {$regex:name,$options: "i"}})


        if(alredy){
                res.render('add_category',{message:"This category alredy exist "})
        }else{

            const Catdata= new CatDB({ name:name})

            const adddata =await Catdata.save()

            if(adddata){
                res.redirect('/admin/category')
            }else{
                res.render('add_category',{message:"somthing wrong "})
            }
        }
    }



    } catch (error) {

        console.log(error.message);
        
    }
}   

const deletecategory =async (req,res)=>{
    try {
        
        const id=req.query.id
        await CatDB.deleteOne({_id:id})
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error.message);
    }
}


const add_categoryLoad = async (req,res)=>{
    try {
        res.render('add_category')
    } catch (error) {
        console.log(error.message);
        
    }
}

const edit_catLoad =async(req,res)=>{
    try {

        
        const id=req.query.id
        const name=req.body.name;

        // const alredy = await CatDB.findOne({name: {$regex:name,$options: "i"}})


        // if(alredy){
        //         res.render('add_category',{message:"This category alredy exist "})
        // }else{



        const editData=await CatDB.findById({_id:id})
        if(editData){
            res.render('edit_category',{data:editData})
        }else{
            res.render('edit_category')

        }
    
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const updatecategory =async (req,res)=>{

    try {
        const name=req.body.name;

        

        
        // const name=req.body.name;
        if(name.trim().length==0){``
            res.redirect('/admin/category')
          }else{
            const alredy = await CatDB.findOne({name: {$regex:name,$options: "i"}})


        if(alredy){
                res.render('add_category',{message:"This category alredy exist "})
        }else{

       
        await CatDB.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name}})
        
                res.redirect('/admin/category')

          }
        }
        
    } catch (error) {
        console.log(error.message);
        
    }


}

const hideshowcategory =async (req,res)=>{
    try {

        const id=req.query.id


        const Cdata =await CatDB.findById({_id:id})

        console.log(Cdata)

        if(Cdata.blocked==false){
            await CatDB.updateOne({_id:id},{$set:{blocked:true}})
            res.redirect('/admin/category')
        }
            if(Cdata.blocked==true){
                await CatDB.updateOne({_id:id},{$set:{blocked:false}})
                res.redirect('/admin/category')
            
        }

        
    } catch (error) {
        console.log(error)
    }
}


//user order_details listing

const orderDetails =async (req,res)=>{
    try {

        const orderData =await order.find()
        console.log(orderData);
        res.render('order_details',{orderData})

        
    } catch (error) {
        console.log(error.message);
        
    }
}


//orderstatus
const orderstatus =async (req,res)=>{
    try {
        const id=req.query.id

        console.log(id);
        const orderData =await order.findById({_id:id})
        
        if(orderData.status=="pending"){

            await order.updateOne({_id:id},{$set:{status:"placed"}})
            res.redirect('/admin/order_details')

        }if(orderData.status=="placed"){
            await order.updateOne({_id:id},{$set:{status:"pending"}})
            res.redirect('/admin/order_details')


        }else{
            res.redirect('/admin/order_details')


        }
        
    } catch (error) {

        console.log(error.message);
        
    }
}

const ordercancelstatus =async (req,res)=>{
    try {
        const id=req.query.id
        const orderData =await order.findById({_id:id})

        if(orderData){
            await order.updateOne({_id:id},{$set:{status:"canceled"}})
            res.redirect('/admin/order_details')

        }




    } catch (error) {
        console.log(error.message);
        
    }
}


//salesReports
const salesReports =async (req,res)=>{
  try {
        const orderdetails = await order.find({status:{$ne:"cancelled"}}).sort({Date:-1})

    res.render('sales_report',{orderdetails})
  } catch (error) {
    console.log(error.message);
    
  }
}
module.exports={
    getLogin,
    veryfiLogin,
    getHome,
    logout,
    getTable,
    veryfiUser,
    blockUser,
    deleteUser,
    categoryLoad,
    insert_category,
    edit_catLoad,
    updatecategory,
    deletecategory,
    add_categoryLoad,
    hideshowcategory,
    orderDetails,
     orderstatus,
     ordercancelstatus,
     salesReports
}


