const express =require('express')
const admin_rout=express()
const path= require('path')
const auth=require('../middleware/adminAuth')
const adminController =require('../controles/adminController')
const productContreoller =require('../controles/product_controller')
const couponController=require('../controles/coupenController')
const upload=require('../config/multer')


admin_rout.set('view engine','ejs')
admin_rout.set('views','./views/admin')

//login
admin_rout.get('/',auth.isLogout,adminController.getLogin)
admin_rout.post('/',adminController.veryfiLogin)

//admin home
admin_rout.get('/home',adminController.getHome)
admin_rout.get('/logout',auth.isLogin,adminController.logout)



//User Details
admin_rout.get('/user_details',auth.isLogin,adminController.getTable)
admin_rout.get('/delete_user',auth.isLogin,adminController.deleteUser)
admin_rout.get('/verify_user',auth.isLogin,adminController.veryfiUser)
admin_rout.get('/block_unblockUser',auth.isLogin,adminController.blockUser)

// category page
admin_rout.get('/category',auth.isLogin,adminController.categoryLoad)
admin_rout.get('/add_category',auth.isLogin,adminController.add_categoryLoad)
admin_rout.post('/add_category',auth.isLogin,adminController.insert_category)
admin_rout.get('/edit_category',auth.isLogin,adminController.edit_catLoad)
admin_rout.post('/edit_category',adminController.updatecategory)

//order_details
admin_rout.get('/order_details',auth.isLogin,adminController.orderDetails)
admin_rout.get('/order_status',auth.isLogin,adminController.orderstatus)
admin_rout.get('/order_cancel',auth.isLogin,adminController.ordercancelstatus)
admin_rout.get('/view_orders',auth.isLogin,adminController.orderview)
admin_rout.get('/order_deliverd',auth.isLogin,adminController.orderdeliverd)

// Products page    in productContreoller
admin_rout.get('/products',auth.isLogin,productContreoller.productload)
admin_rout.get('/add_products',auth.isLogin,productContreoller.addProductload)
admin_rout.post('/add_products',auth.isLogin,upload.upload.array('image',5),productContreoller.insertProduct)
admin_rout.get('/edit_products',auth.isLogin,upload.upload.array('image',5),productContreoller.editProduct)
admin_rout.post('/edit_products',auth.isLogin,upload.upload.array('image',5),productContreoller.posteditProduct)
admin_rout.post('/delete_image',auth.isLogin,productContreoller.postdelete_image)
admin_rout.get('/delete_products',auth.isLogin,upload.upload.array('image',5),productContreoller.deletetProduct)

///sales report
admin_rout.get('/sales_reports',auth.isLogin,adminController.salesReports)
admin_rout.get('/export_to_pdf',auth.isLogin,adminController.exportTopdf)

//coupon
admin_rout.get('/coupon',auth.isLogin,couponController.loadCoupon)
admin_rout.get('/add_coupon',auth.isLogin,couponController.addloadCoupon)
admin_rout.post('/add_coupon',auth.isLogin,couponController.postaddcoupon)
admin_rout.get('/edit_coupon',auth.isLogin,couponController.editCoupon)
admin_rout.post('/edit_coupon',auth.isLogin,couponController.posteditCoupon)
admin_rout.get('/delete_coupon',auth.isLogin,couponController.deleteCoupon)




module.exports = admin_rout
