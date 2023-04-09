const express =require('express')

const rout=express()
const session=require('express-session')

rout.use(session({
    secret:"thisiemysecretkey",
    resave:false,
    saveUninitialized:true
}))
const auth=require('../middleware/userAuth')


  

rout.set('view engine','ejs')
rout.set('views','./views/users')


rout.use(express.json())
rout.use(express.urlencoded({extended:true}))

const userController= require('../controles/userControles')
const adddressController= require('../controles/address_controlller')




//register
rout.get("/register",auth.isLogout,userController.registerLoad)
rout.post("/register",userController.veryfiyUser)

//login
rout.get('/',auth.isLogout,userController.loadLogin)

rout.get('/login',auth.isLogout,userController.loadLogin)
rout.post('/login',userController.veryfiLogin)


//otp
rout.get('/otp',userController.otpVerify)

//otpverifi
rout.post('/otp',userController.otpValidation)

//forget
rout.get('/forget',auth.isLogout,userController.forgetLoad)


rout.post('/forget',userController.forgetSendtoEmail)

//otpresend

rout.get('/resend',auth.isLogout,userController.resend)




//password reset
//rout.get('/reset_password',auth.isLogout,userController.resetpassLoad1)


rout.get('/reset_password',auth.isLogout,userController.resetpassLoad)


rout.post('/reset_password',auth.isLogout,userController.resetpassverify)


//cart
rout.get('/cart',auth.isLogin,userController.getCart)


//addtocart

rout.post("/add_to_cart",auth.isLogin,userController.addtoCart)

//product_checkout
rout.get('/checkout',auth.isLogin,userController.getProduct_checkout)




//adddressController

//add address
rout.get('/add_address',auth.isLogin,adddressController.getadd_address)
//post
rout.post('/add_address',adddressController.veryfyaddess)

//delete_address

rout.get('/delete_address',adddressController.deleteaddress)

//place order


//order_success

rout.get('/order_success',auth.isLogin,userController.ordersuccess_pageLoad)







//logout

rout.get('/logout',auth.isLogin,userController.userLogout)
//home

rout.get('/home',auth.isLogin,userController.getHome)


//shop
rout.get('/shop',auth.isLogin,userController.getShop)


//contact
rout.get('/contact',auth.isLogin,userController.getContact)



//about
rout.get('/about',auth.isLogin,userController.getAbout)




//product_details
rout.get('/product_details',auth.isLogin,userController.getProduct_details)







///user_profile

rout.get('/user_profile',auth.isLogin,userController.getUser_profile)



//404 error

//rout.get('*',auth.isLogin,userController.error404)










  
// rout.get('*',function (req,res){

//     res.redirect('/home')
    
//     })




module.exports=rout



