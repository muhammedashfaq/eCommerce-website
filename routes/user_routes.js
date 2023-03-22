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

//home

rout.get('/home',userController.getHome)






module.exports=rout



