const User= require("../model/user_model")
const bcrypt =require('bcrypt')
const nodemailer = require('nodemailer');
const { getMaxListeners } = require("../model/user_model");
const randomstring=require('randomstring')
const productDB = require('../model/prodect_model')
const CatDB = require('../model/category_Model')
const cart = require('../model/cart_model')
const user_address =require('../model/address_Model')
const order =require('../model/order_Model')

let dotenv = require('dotenv')
dotenv.config()

let otp
let email2
let name2
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





//otp resend

const resend = async(req,res)=>{
    try {

         //Generate a random 4-digit OTP
         const otpGenarated = Math.floor(1000 + Math.random() * 9999);
         otp = otpGenarated

        sendVerifymail(name2,email2,otpGenarated)
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

            res.render('login',{message:"success..!!!"})

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
            const name=req.body.name;
            const alreyMail = await User.findOne({email:email})
            email2=email
            name2=name
            
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

        if(userData.is_verified==1){
            if(userData.is_blocked==false){
                if(userData.email){

                               const passwordMatch= await bcrypt.compare(password,userData.password)

                     if(passwordMatch){

                              req.session.user_id=userData._id
                              res.redirect('/home')

                     }else{
                              res.render('login',{message:"Incorrect Email Or Password"}) 

                          }

                }else{
                              res.render('login',{message:"Incorrect Email Or Password"})

                     }
            }else{
                               res.render('login',{message:"Your Blocked..."})


                 }

        }else{
                              res.render('login',{message:"Your Not verified"})


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
        const userd=await User.findOne({_id:req.session.user_id})

        res.render('home',{product:data,user:userd.name})
        
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
        const userd=await User.findOne({_id:req.session.user_id})

        res.render('shop',{product:data, user:userd.name})
        
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
        // const data =await productDB.find()
        const userd=await User.findOne({_id:req.session.user_id})
        const id =req.session.user_id
        const cartData=await cart.findOne({user:req.session.user_id}).populate('product.productId')
        
        
        
        if(cartData){
            const products=cartData.product
            
            if(products.length>0){
                
                const total = await cart.aggregate([{$match:{user:userd._id}},

                    {$unwind:"$product"},

                    {$project:{price:"$product.price",quantity:"$product.quantity"}},

                    {$group:{_id:null,total:{$sum:{$multiply:["$price","$quantity"]}}}}]);

                    
                  
                   
                    const Total= total[0].total;

                    const useRID=userd._id
            
                    res.render('cart',{user:userd.name,products:products, Total,useRID})
            }else{

                res.render('cart',{user:userd.name,products: undefined})
            }

         }else{

            res.render('cart',{user:userd.name,})
        }

        
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const addtoCart =async (req,res)=>{
    try {


        const productId= req.body.id
      
        const UserId= await User.findOne({_id:req.session.user_id})
        // console.log('sfegreg'+email);
        // const userData=await User.findOne({_id:email})
        // const UserId =userData._id
        // console.log(UserId);

        //database checking
        const productData = await productDB.findById(productId)
        const Usercart =await cart.findOne({user:UserId})
       
        if(Usercart) {
            //checking cart prodcut avaliable
            const productavaliable = await Usercart.product.findIndex( product => product.productId == productId)
            if(productavaliable != -1){
                //if have product in cart the qnty increse
                await cart.findOneAndUpdate({user : UserId, "product.productId" : productId},{$inc : {"product.$.quantity" : 1}})
                res.json({success:true})
            }else{
                //if no product in cart add product
                await cart.findOneAndUpdate({user : UserId},{$push : {product:{productId : productId, price : productData.price}}})
                res.json({success:true})
            }

        }else{
            const CartData =new cart({
                user:UserId._id,
                product:[{
                    productId:productId,
                    price:productData.price
                }]

            })
            const cartData=await CartData.save();
            if(cartData){
                res.json({success:true})
            }else{
                res.redirect('/home')
            }
        }
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const getProduct_details = async(req,res)=>{
    try {

         const id = req.query.id
         
         const prodata=await productDB.findById({_id:id})
         const userd=await User.findOne({_id:req.session.user_id})


        res.render('Product_details',{product:prodata,user:userd.name})
        
    } catch (error) {
        console.log(error.message);
        
    }
}


const getProduct_checkout = async(req,res)=>{
    try {
        const address =await user_address.findOne({user:req.session.user_id});
        const data =await productDB.find()
        const userd=await User.findOne({_id:req.session.user_id})
        const cartData=await cart.findOne({user:userd._id}).populate("product.productId")

        if(cartData.product.length>0){
            const addressData = address.address;

            const total = await cart.aggregate([{$match:{user:userd._id}},

                {$unwind:"$product"},

                {$project:{price:"$product.price",quantity:"$product.quantity"}},

                {$group:{_id:null,total:{$sum:{$multiply:["$price","$quantity"]}}}}]);

                console.log('cart data take');
              
               
                const Total= total[0].total;

            res.render('checkout',{product:data,Total, user:userd.name,address:addressData})
            console.log('0ne');



        }else{
            console.log('tne');
            res.render('checkout',{product:data, user:userd.name,address:undefined })

            
        }
        

       
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const placetheorder =async(req,res)=>{
    try {
         const userd=await User.findOne({_id:req.session.user_id})
        const total = await cart.aggregate([{$match:{user:userd._id}},

            {$unwind:"$product"},

            {$project:{price:"$product.price",quantity:"$product.quantity"}},

            {$group:{_id:null,total:{$sum:{$multiply:["$price","$quantity"]}}}}]);

            
          
           
            const Total= total[0].total;
           

      
        const address=req.body.address
        const payment=req.body.payment
        // const userData = req.session.user_id
        const userDetails =await User.findOne({_id:req.session.user_id})
        const cartData =await cart.findOne({user:userDetails._id})
        const products=cartData.product

        const status = payment === "COD"?"placed" :"pending"



      const newOrder = new order({


           deliveryDetails:address,
            user:userDetails._id,
            userName:userDetails.name,
            paymentMethod:payment,
            product:products,   
            totalAmount:Total,
            Date:Date.now(),
            status:status

        })

        const saveOrder = await newOrder.save()
        const orderid=newOrder._id
         
        

        if(status=="placed"){
            
            await cart.deleteOne({user:userDetails._id})
            
            res.render('order_success',{user:userd.name,Total})
        }else{
            
            res.render('order_success',{user:userd.name})
        }



    } catch (error) {  

        console.log(error.message);
    }
}


//deletcartitem

const deletcartitem =async(req,res)=>{
    try {
        
        const id =req.body.id

        console.log(id);
        
        await cart.findOneAndUpdate({"product.productId":id},{$pull:{product:{productId:id}}})
        res.json({success:true})
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

const getUser_profile =async(req,res)=>{

    try {
        const address =await user_address.findOne({user:req.session.user_id});

        const userd=await User.findOne({_id:req.session.user_id})
        const userData=await User.findOne({_id:req.session.user_id})

      
        res.render('user_profile',{user:userd.name,data:userData,address})


           



    } catch (error) {
        console.log(error.message);
        
    }
}


module.exports={
    registerLoad,
    veryfiyUser,
    otpVerify,
    resend,
    loadLogin,
    veryfiLogin,
    forgetLoad,
    forgetSendtoEmail,
    resetpassLoad,
    resetpassverify,
    getHome,
    getCart,
    addtoCart,
    getProduct_details,
    getProduct_checkout,
    placetheorder,
    deletcartitem,
   


    userLogout,
    getShop,
    getContact,
    getAbout,
    


    otpValidation,
    error404,
    getUser_profile
}

