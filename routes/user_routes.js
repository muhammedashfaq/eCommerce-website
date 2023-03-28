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
//rout.use('/',userController)


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


//password reset
rout.get('/reset_password',auth.isLogout,userController.resetpassLoad1)


rout.get('/reset_password',auth.isLogout,userController.resetpassLoad)

rout.post('/reset_password',auth.isLogout,userController.resetpassverify)







//logout

rout.get('/logout',auth.isLogin,userController.userLogout)
//home

rout.get('/home',auth.isLogin,userController.getHome)


//shop
rout.get('/shop',userController.getShop)


//contact
rout.get('/contact',userController.getContact)



//about
rout.get('/about',userController.getAbout)


//cart
rout.get('/cart',userController.getCart)


//product_details
rout.get('/product_details',userController.getProduct_details)


//product_checkout
rout.get('/checkout',userController.getProduct_checkout)










module.exports=rout



