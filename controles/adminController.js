const User= require("../model/user_model")
const admin=require('../model/admin_model')
const CatDB=require('../model/category_Model')


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

                console.log("adminData");

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
       
        res.render('home')
        
    } catch (error) {
        console.log(error.message);
        
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

      

        const alredy = await CatDB.findOne({name:  /^name/i })


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
        if(name.trim().length==0){
            res.redirect('/admin/category')
          }else{
        await CatDB.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name}})
        
                res.redirect('/admin/category')

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
    hideshowcategory
}


