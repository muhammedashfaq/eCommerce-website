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
        console.log(adminData);


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
        
        req.session.destroy()
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

const new_userLoad=async (req,res)=>{
    try {
        res.render('new_user')
    } catch (error) {
        console.log(error.message)        
    }
}

const add_user =async (req,res)=>{
    try {

        const name=req.body.name;
        const email= req.body.email;
        const mob=req.body.mob;
        const spassword =await securePassword(req.body.password)
        console.log(name, email, mob, spassword);

        //alredy mail

        const alredyMail = await User.findOne({email:email})
        console.log(alredyMail);
        if(alredyMail){
            res.render('new_user',{message:"Email Alredy Exist"})
        }
        else{

            const userData= new User({

                name:name,
                email:email,
                mob:mob,
                password:spassword,
                is_admin:0,
                is_verified:0



            })

            const addUdata= await userData.save()
            console.log(addUdata);

            if(addUdata){
                res.redirect('/admin/user_details')

                console.log('aqqqq');

            }else{
                res.render('new_user',{message:"something error"})
            }
        }
        
    } catch (error) 
    {
            console.log(error.message);        
    }
}



const veryfiUser = async(req,res)=>{
    try {
        const id=req.query.id
        await User.updateOne({_id:id},{$set:{is_verified:1}})
        res.redirect('/admin/user_details')


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





const edit_userLoad=async (req,res)=>{
    try {
        const id=req.query.id
         console.log(id)
         const editData = await User.findById({_id:id})
         if(editData){
            res.render('edit_user',{data:editData})
         }else{
            res.render('edit_user')
         }
    } catch (error) {
        console.log(error.message)        
    }   
}




const updateUser=async(req,res)=>{
    try {
      const name = req.body.name;
      const email=req.body.email;
      console.log(name);
      if(name.trim().length==0){
        res.redirect('/admin/user_details')
      }else{
     const userData=await User.findOneAndUpdate({email:req.body.email},{$set:{name:req.body.name,email:req.body.email,mob:req.body.mob}})
     console.log(userData);
      res.redirect('/admin/user_details')
    }
    } catch (error) {
      console.log(error.message);
      
    }
    
    };
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

      

        const alredy = await CatDB.findOne({name:name})
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



module.exports={
    getLogin,
    veryfiLogin,
    getHome,
    logout,
    getTable,
    new_userLoad,
    add_user,
    edit_userLoad,
    updateUser,
    veryfiUser,
    blockUser,
    deleteUser,
    categoryLoad,
    insert_category,
    edit_catLoad,
    updatecategory,
    deletecategory,

    add_categoryLoad
}


