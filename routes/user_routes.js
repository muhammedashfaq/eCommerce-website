const express =require('express')
const rout=express()
const auth=require('../middleware/userAuth')

rout.set('view engine','ejs')
rout.set('views','./views/users')

//controllers
const userController= require('../controles/userControles')
const adddressController= require('../controles/address_controlller')
const couponController=require('../controles/coupenController')

//register
rout.get("/register",auth.isLogout,userController.registerLoad)
rout.post("/register",userController.veryfiyUser)

//login
rout.get('/',auth.isLogout,userController.loadLogin)
rout.get('/login',auth.isLogout,userController.loadLogin)
rout.post('/login',userController.veryfiLogin)
rout.get('/otp',userController.otpVerify)
rout.post('/otp',userController.otpValidation)
rout.get('/forget',auth.isLogout,userController.forgetLoad)
rout.post('/forget',userController.forgetSendtoEmail)
rout.get('/resend',auth.isLogout,userController.resend)
rout.get('/reset_password',auth.isLogout,userController.resetpassLoad)
rout.post('/reset_password',auth.isLogout,userController.resetpassverify)
//logout
rout.get('/logout',auth.isLogin,userController.userLogout)

//cart
rout.get('/cart',auth.isLogin,userController.getCart)
rout.post('/delete_cartitem',auth.isLogin,userController.deletcartitem)
rout.post("/add_to_cart",auth.isLogin,userController.addtoCart)
rout.post("/cartqntyincrese",auth.isLogin,userController.cartquantity,userController.totalproductprice)



//product_checkout
rout.get('/checkout',auth.isLogin,userController.getProduct_checkout)
rout.post('/checkout',userController.placetheorder)
rout.get('/order-placed',auth.isLogin,userController.orderplaced)
rout.post('/verifyPayment',userController.verifyOnlinePayment)
rout.post('/walamount',userController.walamount)



//applyCoupon
rout.post('/applyCoupon',couponController.applyCoupon)

/////BUY NOW////
rout.post("/buynow",auth.isLogin,userController.buynow)
rout.get("/checkoutbuy",auth.isLogin,userController.buynowrender)
rout.post('/checkoutbuy',userController.placetheorderbuy)
rout.post('/verifyBuynowPayment',userController.verifyBuynowPayment)

//adddressController
rout.get('/add_address',auth.isLogin,adddressController.getadd_address)
rout.post('/add_address',adddressController.veryfyaddess)
rout.get('/delete_address',adddressController.deleteaddress)
rout.post('/deleteaddress',adddressController.deleteaddress)
rout.get('/edit_address',adddressController.editaddress)
rout.post('/edit_address',adddressController.posteditaddress)

rout.get('/add_addresscheck',auth.isLogin,adddressController.getadd_address)
rout.post('/add_addresscheck',adddressController.veryfyaddesscheck)
rout.get('/edit_addresscheck',adddressController.editaddress)
rout.post('/edit_addresscheck',adddressController.posteditaddresscheck)




rout.get('/home',auth.isLogin,userController.getHome)
rout.get('/shop',auth.isLogin,userController.getShop)
rout.get('/contact',auth.isLogin,userController.getContact)
rout.get('/about',auth.isLogin,userController.getAbout)
rout.get('/product_details',auth.isLogin,userController.getProduct_details)

///user_profile
rout.get('/user_profile',auth.isLogin,userController.getUser_profile)
rout.post('/user_profile',userController.postprofilesubmit)

//order list
rout.get('/orderlist',auth.isLogin,userController.orderlistLoad)
rout.get('/order_show',auth.isLogin,userController.ordershowLoad)
rout.post('/cancel_order',auth.isLogin,userController.canceluserorder)
rout.post('/return_order',auth.isLogin,userController.returnuserorder)
// rout.get('/invoice_pdf',auth.isLogin,userController.orderInvoice)



module.exports=rout



