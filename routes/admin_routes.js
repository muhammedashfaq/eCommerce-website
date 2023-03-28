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
const productContreoller =require('../controles/product_controller')
const category_Model = require('../model/category_Model')

//login
admin_rout.get('/',auth.isLogout,adminController.getLogin)

admin_rout.post('/',adminController.veryfiLogin)


//admin home
admin_rout.get('/home',adminController.getHome)

//logout

admin_rout.get('/logout',auth.isLogin,adminController.logout)



//User Details
admin_rout.get('/user_details',auth.isLogin,adminController.getTable)

//add user
admin_rout.get('/new_user',auth.isLogin,adminController.new_userLoad)

admin_rout.post('/new_user',adminController.add_user)

//edit_user
admin_rout.get('/edit_user',auth.isLogin,adminController.edit_userLoad)

admin_rout.post('/edit_user',adminController.updateUser)

//delete_user
admin_rout.get('/delete_user',auth.isLogin,adminController.deleteUser)

//verify user
admin_rout.get('/verify_user',auth.isLogin,adminController.veryfiUser)




// category page

admin_rout.get('/category',auth.isLogin,adminController.categoryLoad)

//add category
admin_rout.get('/add_category',auth.isLogin,adminController.add_categoryLoad)

admin_rout.post('/add_category',auth.isLogin,adminController.insert_category)

//delete category
admin_rout.get('/delete_category',auth.isLogin,adminController.deletecategory)

//edit_category
admin_rout.get('/edit_category',auth.isLogin,adminController.edit_catLoad)

admin_rout.post('/edit_category',adminController.updatecategory)


// Products page    in productContreoller

admin_rout.get('/products',auth.isLogin,productContreoller.productload)

//add_productsLoad
admin_rout.get('/add_products',auth.isLogin,productContreoller.addProductload)

//inert_products
admin_rout.post('/insert_products',auth.isLogin,productContreoller.insertProduct)












admin_rout.get('*',function (req,res){

    res.redirect('/admin')
    
    })



module.exports = admin_rout
