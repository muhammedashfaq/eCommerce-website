const User= require("../model/user_model")
const bcrypt =require('bcrypt')

///bcrypt password
const securePassword=async(password)=>{
    try {
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
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

        const data =new User({
        name:req.body.name,
        email:req.body.email,
        mob:req.body.mob,
        password:spassword,
        is_admin:0
    })

    const Udata = await data.save()
    
    if(Udata){

        res.render('login',{alert:'done'})
    }else{
        res.render('register',{alert:'note done'})

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

            if(userData){
                const passwordMatch= await bcrypt.compare(password,userData.password)
                if(passwordMatch){
                    req.session.user_id=userData.id
                    res.redirect('/home')
                }else{
                    res.render('login') 
                    console.log('hi');

                }
            }else{
                res.render('login')

            }
        
    } catch (error) {
        console.log(error.message);
        
    }



}

const getHome = async(req,res)=>{
    try {

        res.render('home')
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const userLogout=async(req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/')
        
    } catch (error) {
        console.log(error.message);
        
    }
}
const getShop = async(req,res)=>{
    try {

        res.render('shop')
        
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

        res.render('Product_details')
        
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





module.exports={
    registerLoad,
    veryfiyUser,
    loadLogin,
    veryfiLogin,
    getHome,
    userLogout,
    getShop,
    getContact,
    getAbout,
    getCart,
    getProduct_details,
    getProduct_checkout
}

