const User= require("../model/user_model")
const bcrypt =require('bcrypt')
const nodemailer = require('nodemailer');
const { getMaxListeners } = require("../model/user_model");
const randomstring=require('randomstring')
const productDB = require('../model/prodect_model')
const CatDB = require('../model/category_Model')


let dotenv = require('dotenv')
dotenv.config()

let otp
let email2
///bcrypt password
const securePassword=async(password)=>{
    try {
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
        
    }

}

//for send mail

const sendVerifymail= async (name,email,otp)=>{
    try {
       
       const transporter= nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.email,
                pass:process.env.password
            }
        })
        const mailOption={
            from:"aspu17@gmail.com ",
            to:email,
            subject:"For OTP verification",
            //html:"<p> Hii  " +name+ "  please enter  " +otp+ "  as your OTP for verification </p>"
            // html:'<p>hi '+name+' ,please click here to<a href="http://localhost:3000/otp " '+email+' >varify</a> for verify and enter the '+otp+ ' </p>'
            html:'<p>hi'+name+',please click here to<a href="http://localhost:3000/otp">varify</a> and enter the'+otp+' for your verification '+email+ '</p>',

    

        }

        transporter.sendMail(mailOption,(error,info)=>{
            if(error){
                console.log(error.message);
            }else{
                console.log("emai has been send to:",info.response);
            }
        })
        
    } catch (error) {
        console.log(error.message);
        
    }
}
//for reset password send mail

const resetsendVerifymail= async (name,email,token)=>{
    try {
       
       const transporter= nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.email,
                pass:process.env.password
            }
        })
        const mailOption={
            from:process.env.email,
            to:email,
            subject:"For Reset password",
            //html:"<p> Hii  " +name+ "  please enter  " +otp+ "  as your OTP for verification </p>"
            // html:'<p>hi '+name+' ,please click here to<a href="http://localhost:3000/otp " '+email+' >varify</a> for verify and enter the '+otp+ ' </p>'
            html:'<p>hi '+name+' ,please click here to<a href="http://localhost:3000/reset_password?token='+token+'">Reset</a> your password </p>'

    

        }

        transporter.sendMail(mailOption,(error,info)=>{
            if(error){
                console.log(error.message);
            }else{
                console.log("emai has been send to:",info.response);
            }
        })
        
    } catch (error) {
        console.log(error.message);
        
    }
}

//otpLOad

const otpVerify =async (req,res)=>{
    try {

        

        res.render('otp_verification')
        
    } catch (error) {
        console.log(error.message);
        
    }
}

//otpValidation

const otpValidation =async(req,res)=>{
    try {
        const otpinput = req.body.otp;
 
        if(otpinput==otp){

 await  User.findOneAndUpdate({email:email2},{$set:{is_verified:1}})

            res.render('login',{message:"done"})

        }else
        res.redirect('/otp')
    } catch (error) {
        console.log(error.message);
        
    }
}

//register page load

const registerLoad = async (re,res)=>{
    try {
        
        res.render("register")



    } catch (error) {
        console.log(error.message);
        
    }
}

//register page insert user
const veryfiyUser= async (req,res)=>{
    try {
            const spassword=await securePassword(req.body.password);
            const email = req.body.email;
            const alreyMail = await User.findOne({email:email})
            email2=email
            
            if(alreyMail){
                res.render('register',{message:"EMAIL ALREADY EXIST "})
            }else{

        const data =new User({
        name:req.body.name,
        email:req.body.email,
        mob:req.body.mob,
        password:spassword,
        is_admin:0,
        is_verified:0,
        is_blocked:false


    })

    const Udata = await data.save()
    
    if(Udata){

         // Generate a random 4-digit OTP
         const otpGenarated = Math.floor(1000 + Math.random() * 9999);
         otp = otpGenarated

        sendVerifymail(req.body.name,req.body.email,otpGenarated)
        res.render('otp_verification')
    }else{
        res.render('register',{alert:'registration not completed'})

    }
}
        
    } catch (error) {

    console.log(error.message);
        
    }
}

//login page
const loadLogin=async (req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
        
    }
}


const veryfiLogin= async (req,res)=>{

    try {


        const email=req.body.email
        const password=req.body.password 
        const userData=await User.findOne({email:email})  

            if(userData.email&&userData.is_verified==1&&userData.is_blocked==false){
                const passwordMatch= await bcrypt.compare(password,userData.password)
       
                if(passwordMatch){
                    req.session.user_id=userData._id

                    res.redirect('/home')
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

///forget passwd

const forgetLoad =async(req,res)=>{
    try {
        res.render("forget_password")
    } catch (error) {

        console.log(error.message);
        
    }
}


const forgetSendtoEmail =async(req,res)=>{
    try {

        const email=req.body.email;
        const userData = await User.findOne({email : email})
        if(userData){
            if(userData.is_verified==0){
                res.render('forget_password',{message:"Email Not veryfied"})
            }else{
                const randomstrinG= randomstring.generate()

               const Updateddata=await User.updateOne({email:email},{$set:{token:randomstrinG}})
               const user=await User.findOne({email:email})


               resetsendVerifymail(user.name,user.email,randomstrinG)

               res.render('forget_password',{message:"Please check your Mail for Reset your password"})


            }


        }else{
            res.render('forget_password',{message:"Wrong Email Id"})
        }
    } catch (error) {

        console.log(error.messages
            );
        
    }
}


const  resetpassLoad =async(req,res)=>{



    try {
        const token = req.query.token
        const userData = await User.findOne({token : token})
        if(userData){
            res.render('reset_password',{email : userData.email})
        }else{
            res.render('404',{message : 'Invlaid Token'})
        }
    } catch (error) {
        console.log(error.message);
    }
 
}

const resetpassverify =async (req,res)=>{
    try {
        const password =req.body.password
        const email=req.body.email;
        
        const spassword =await securePassword(password)

       const updatedData= await User.findOneAndUpdate({email:email},{$set:{password:spassword,token:''}})

       res.redirect('/')
       
    } catch (error) {
        console.log(error.message);
    }
   
}   
const getHome = async(req,res)=>{
    try {

        const data =await productDB.find()

        const userd=await User.find()

        res.render('home',{product:data,user:userd})
        
    } catch (error) {
        
        console.log(error.message);
        
    }
}

const userLogout=async(req,res)=>{
    try {
        req.session.user_id=false
        res.redirect('/')
        
    } catch (error) {
        console.log(error.message);
        
    }
}
const getShop = async(req,res)=>{
    try {

        const data =await productDB.find()
        

        res.render('shop',{product:data})
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const getContact = async(req,res)=>{
    try {

        res.render('contact')
        
    } catch (error) {
        console.log(error.message);
        
    }
}


const getAbout= async(req,res)=>{
    try {

        res.render('about')
        
    } catch (error) {
        console.log(error.message);
        
    }
}


const getCart = async(req,res)=>{
    try {

        res.render('cart')
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const getProduct_details = async(req,res)=>{
    try {

         const id = req.query.id
         
         const prodata=await productDB.findById({_id:id})

        res.render('Product_details',{product:prodata})
        
    } catch (error) {
        console.log(error.message);
        
    }
}


const getProduct_checkout = async(req,res)=>{
    try {

        res.render('checkout')
        
    } catch (error) {
        console.log(error.message);
        
    }
}



const error404=async(req,res)=>{
    try {
        res.render('404')
        
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports={
    registerLoad,
    veryfiyUser,
    otpVerify,
    loadLogin,
    veryfiLogin,
    forgetLoad,
    forgetSendtoEmail,
    resetpassLoad,
    resetpassverify,
    getHome,
    userLogout,
    getShop,
    getContact,
    getAbout,
    getCart,
    getProduct_details,
    getProduct_checkout,
    otpValidation,
    error404
}

