const User= require("../model/user_model")
const admin=require('../model/admin_model')


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
        await User.updateOne({_id:id},{$set:{is_veryfied:1}})
        res.redirect('/admin/user_details')


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


// const edit_user=async (req,res)=>{
//     try {
        
//         const name=req.body.name;
//         if(name==' '){
//             res.redirect('/admin/edit_user')
//         }else{
//             await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mob:req.body.mob}})
//             res.redirect('/admin/edit_user')
//         }
//     } catch (error) {
//         console.log(error.message);
        
//     }
// }


const updateUser=async(req,res)=>{
    try {
      const name = req.body.name;
      console.log(name);
      if(name==""){
        res.redirect('/admin/dashboard')
      }else{
     const userData=await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mob:req.body.mob}})
     console.log(userData);
      res.redirect('/admin/dashboard')
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
        res.render('category')
    } catch (error) {
        console.log(error.message);
        
    }
}

const productload = async (req,res)=>{
    try {
        res.render('products')
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
    deleteUser,
    categoryLoad,
    productload,
    add_categoryLoad
}

