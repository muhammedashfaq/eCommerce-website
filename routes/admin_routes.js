const express =require('express')

const admin_rout=express()
const session=require('express-session')
const  multer=require('multer')
const path= require('path')

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

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/admin/assets/product_images'))

    },
    filename:function(req,file,cb){
        const name= Date.now()+'-'+file.originalname
        cb(null,name)
    }
})
const fileFilter = function (req, file, cb) {
    // Check if file is a jpg/jpeg image
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/*') {
      cb(null, true)
    } else {
      cb(new Error('Only jpg/jpeg images are allowed'))
    }
  }
  

const upload =multer({storage:storage})

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





//delete_user
admin_rout.get('/delete_user',auth.isLogin,adminController.deleteUser)

//verify user
admin_rout.get('/verify_user',auth.isLogin,adminController.veryfiUser)

//block/unblock user
admin_rout.get('/block_unblockUser',auth.isLogin,adminController.blockUser)





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

//hide_show

admin_rout.get('/hideshow_category',adminController.hideshowcategory)


//order_details
admin_rout.get('/order_details',auth.isLogin,adminController.orderDetails)

//
 admin_rout.get('/order_status',auth.isLogin,adminController.orderstatus)

 //orderCancel

 admin_rout.get('/order_cancel',auth.isLogin,adminController.ordercancelstatus)






// Products page    in productContreoller

admin_rout.get('/products',auth.isLogin,productContreoller.productload)

//add_productsLoad
admin_rout.get('/add_products',auth.isLogin,productContreoller.addProductload)

//inert_products
admin_rout.post('/add_products',upload.array('image',5),auth.isLogin,productContreoller.insertProduct)

//edit_products

admin_rout.get('/edit_products',upload.array('image',5),auth.isLogin,productContreoller.editProduct)

admin_rout.post('/edit_products',upload.array('image',5),auth.isLogin,productContreoller.posteditProduct)

//delete_images_in_edit page

admin_rout.post('/delete_image',auth.isLogin,productContreoller.postdelete_image)

//delete_product

admin_rout.get('/delete_products',upload.array('image',5),auth.isLogin,productContreoller.deletetProduct)

////sales_reports



admin_rout.get('/sales_reports',auth.isLogin,adminController.salesReports)










// admin_rout.get('*',function (req,res){

//     res.redirect('/admin')
    
//     })



module.exports = admin_rout
