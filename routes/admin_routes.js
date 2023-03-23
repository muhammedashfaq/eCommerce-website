const express =require('express')

const admin_rout=express()
const session=require('express-session')

admin_rout.use(session({
    secret:"thisiemysecretkey",
    resave:false,
    saveUninitialized:true
}))
//const auth=require('../middleware/userAuth')

admin_rout.set('view engine','ejs')
admin_rout.set('views','./views/admin')


admin_rout.use(express.json())
admin_rout.use(express.urlencoded({extended:true}))

const adminController =require('../controles/adminController')


admin_rout.get('/',adminController.getLogin)


module.exports = admin_rout
