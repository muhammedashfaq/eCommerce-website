const User= require("../model/user_model")
const admin=require('../model/admin_model')

const bcrypt =require('bcrypt')

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
        console.log(adminData);


        if(adminData){
            if(password==adminData.password){

                console.log(adminData);
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
        
        req.session.destroy()
        res.redirect('/admin')

        
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports={
    getLogin,
    veryfiLogin,
    getHome,
    logout
}


