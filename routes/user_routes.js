const express =require('express')

const rout=express()

rout.set('view engine','ejs')
rout.set('views','./views/users')


rout.use(express.json())
rout.use(express.urlencoded({extended:true}))

const userController= require('../controles/userControles')
//rout.use('/',userController)


//register
rout.get("/register",userController.registerLoad)
rout.post("/register",userController.veryfiyUser)

//login
rout.get('/',userController.loadLogin)

rout.get('/login',userController.loadLogin)
rout.post('/login',userController.veryfiLogin)


//home

rout.get('/home',userController.getHome)


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



