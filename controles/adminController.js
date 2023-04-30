const User= require("../model/user_model")
const admin=require('../model/admin_model')
const CatDB=require('../model/category_Model')
const order =require('../model/order_Model')
const productDB = require('../model/prodect_model')

///html to pdfgenerate require things
 const ejs =require('ejs')
 const pdf=require('html-pdf')
 const fs= require('fs')
 const path = require('path')

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
            const total = await order.aggregate([{$group:{_id:null,totalAmount:{$sum:"$totalAmount"}}}])
            const Total = total[0].totalAmount;
            const Users = await User.find({is_admin:0}).count();
            const Orders = await order.find({}).count();
            const Products = await productDB.find({}).count();
            const onlineCount = await order.aggregate([{$match:{paymentMethod:"online"}},{$group:{_id:"$paymentMethod ",total:{$count:{}}}}])
            const COD = await order.aggregate([{$match:{paymentMethod:"COD"}},{$group:{_id:"$paymentMethod ",total:{$count:{}}}}])
            const onlineCounts = await order.aggregate([{$group:{_id:"$paymentMethod",totalPayment:{$count:{}}}}])
        if(onlineCounts){
            let sales = [];

            var date = new Date();

            var year = date.getFullYear();

            var currentyear = new Date(year, 0, 1);

        let salesByYear = await order.aggregate([{$match:{createdAt:{$gte:currentyear},status:{$ne:"cancelled"}}},{$group:{
              
            _id:{$dateToString:{format:"%m",date:"$createdAt"}},
               
            totalAmount:{$sum:"$totalAmount"},  
           
        }},{$sort:{_id:1}}]);
          for(let i=1;i<=12;i++){
                let result = true;
                for(let k=0;k<salesByYear.length;k++){
                    result = false;
                    if(salesByYear[k]._id==i){
                        sales.push(salesByYear[k])
                        break;
                    }else{
                        result = true
                    }
                }
                if(result) sales.push({_id:i,totalAmount:0});
            }

            let salesData = [];
            for(let i=0;i<sales.length;i++){
                salesData.push(sales[i].totalAmount);
            }
            
            res.render('home',{userData,Users,Orders,Products,Total,onlineCount,onlineCounts,COD,month:salesData})
        }
                 
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
            const block = await User.updateOne({_id:id},{$set:{is_blocked:true}})
            if(block){
                req.session.user_id=false
            }

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
//user order_details listing

const orderDetails =async (req,res)=>{
    try {

        const orderData =await order.find()
        res.render('order_details',{orderData})

        
    } catch (error) {
        console.log(error.message);
        
    }
}


//orderstatus
const orderstatus =async (req,res)=>{
    try {
        const id=req.query.id

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

//orderdeliverd

const orderdeliverd =async (req,res)=>{
    try {

        const id=req.query.id
        const orderData =await order.findById({_id:id})

        if(orderData.status=="placed"){
            await order.updateOne({_id:id},{$set:{status:"delivered"}})
            res.redirect('/admin/order_details')

        }if(orderData.status=="waiting for approval"){
            await order.updateOne({_id:id},{$set:{status:"Return Approved"}})
          
               
                const total = orderData.totalAmount+orderData.orderWallet
                await User.findByIdAndUpdate(orderData.user,{$inc:{wallet:total}})
                res.redirect('/admin/order_details')

        }else{
            res.redirect('/admin/order_details')

        }
        
    } catch (error) {
        console.log(error.message);
    }
}

//orderview
const orderview =async (req,res)=>{
    try {

        const id =req.query.id
        const orderData=await order.findById({_id:id}).populate("product.productId")
        const product=orderData.product

        //console.log(orderData);


        res.render('order_view',{orderData,product})
    } catch (error) {
        console.log(error.message);
        
    }
}

//salesReports
const salesReports =async (req,res)=>{
  try {
    let from = new Date(req.query.from) 
    let to = new Date(req.query.to)

    req.query.from ? from = new Date(req.query.from) : from = 'ALL'
    req.query.to ? to = new Date(req.query.to) : to = 'ALL'

    if(from !== "ALL" && to !== "ALL"){
        const orderdetails=await order.aggregate([
            {
                $match : {
                    $and : [{Date : {$gte : from}},{Date : {$lte : to}}]
                }
            }
        ])
        req.session.Orderdtls=orderdetails
        console.log(orderdetails);
        const products=orderdetails.product

        res.render('sales_report',{orderdetails,from,to,products})
    }else{
        const orderdetails = await order.find({status:{$ne:"cancelled"}})
        const products=orderdetails.product

        res.render('sales_report',{orderdetails,from,to,products})
    }

          

  } catch (error) {
    console.log(error.message);
  }
}

//export sales report to pdf

const exportTopdf =async (req,res)=>{
    try {
            const from =req.query.from
            const to =req.query.to

        

        const orderdetails = await order.find({status:{$ne:"cancelled"}}).populate("product.productId").sort({Date:-1})
        const products=orderdetails.product

        const data={
            report: req.session.Orderdtls,
            product:products
        }

        const filepath =path.resolve(__dirname,'../views/admin/salesreporttopdf.ejs')
        const htmlstring=fs.readFileSync(filepath).toString()
       
       let option={
        format:"A3"
       }
       const ejsData=  ejs.render(htmlstring,data)
       pdf.create(ejsData,option).toFile('salesReport.pdf',(err,response)=>{
        if(err) console.log(err);

      const filepath= path.resolve(__dirname,'../salesReport.pdf')
      fs.readFile(filepath,(err,file)=>{
        if(err) {
            console.log(err);
            return res.status(500).send('could not download file')
        }
        res.setHeader('Content-Type','application/pdf')
        res.setHeader('Content-Disposition','attatchment;filename="Sales Report.pdf"')

        res.send(file)

      })
       })
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
    add_categoryLoad,
    orderDetails,
     orderstatus,
     ordercancelstatus,
     orderdeliverd,
     orderview,
     salesReports,
     exportTopdf
}


