const express =require('express')

const admin_rout=express()
const session=require('express-session')

admin_rout.use(session({
    secret:"thisiemysecretkey",
    resave:false,
    saveUninitialized:true
}))
const auth=require('../middleware/adminAuth')

admin_rout.set('view engine','ejs')
admin_rout.set('views','./views/admin')


admin_rout.use(express.json())
admin_rout.use(express.urlencoded({extended:true}))

const adminController =require('../controles/adminController')

//login
admin_rout.get('/',auth.isLogout,adminController.getLogin)

admin_rout.post('/',adminController.veryfiLogin)


//admin home
admin_rout.get('/home',adminController.getHome)

//logout

admin_rout.get('/logout',auth.isLogin,adminController.logout)



//tables
admin_rout.get('/tables',auth.isLogin,adminController.getTable)







module.exports = admin_rout
