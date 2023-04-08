const User= require("../model/user_model")
const admin=require('../model/admin_model')
const CatDB=require('../model/category_Model')
const productdb=require('../model/prodect_model')
const user_address =require('../model/address_Model')
const productDB = require('../model/prodect_model')
const address_Model = require("../model/address_Model")




const getadd_address =async (req,res)=>{
    try {

        const data =await productDB.find()
        const userd=await User.findOne({_id:req.session.user_id})
      

        res.render('add_address',{product:data, user:userd.name})
        
    } catch (error) {
            console.log(error.message);        
    }
    
}





const veryfyaddess =async (req,res)=>{
    try {

      
            const user=req.session.user_id

            const userData= await User.findOne({_id:req.session.user_id})
            const dataaddress = await user_address.findOne({user:req.session.user_id})
            if(dataaddress){

                console.log(dataaddress);

                const update= await user_address.updateOne({user:user},{$push:{address:{

                    fname:req.body.fname,
                    sname:req.body.sname,
                    mobile:req.body.mobile,
                    email:req.body.email,
                    address:req.body.address,
                    pin:req.body.pin
    
                }}})
                console.log(update);
                if(update){
                    res.redirect('/checkout')


                }else{
                    res.redirect('/checkout')

                }



            }else{

        const data = new user_address({
            user:userData._id,
            address:[{
                fname:req.body.fname,
                sname:req.body.sname,
                mobile:req.body.mobile,
                email:req.body.email,
                address:req.body.address,
                pin:req.body.pin
        }]

        })
        const addressData= await data.save()
        if(addressData){
            res.redirect('/checkout')
        }else{
            res.redirect('/checkout')

        }

    }
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const deleteaddress=async (req,res)=>{
    try {
        const id=req.query.id
        await address_Model.updateOne({user:req.session.user_id},{$pull:{address:{_id:id}}})
        res.redirect('/checkout')
    } catch (error) {
        console.log(error.message);
        
    }
}


module.exports={
    getadd_address,
    veryfyaddess,
    deleteaddress

}