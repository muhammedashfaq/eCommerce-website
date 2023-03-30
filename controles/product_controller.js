const User= require("../model/user_model")
const admin=require('../model/admin_model')
const CatDB=require('../model/category_Model')
const productdb=require('../model/prodect_model')


const productload = async (req,res)=>{
    try {
        const data = await productdb.find()

        res.render('products',{product:data})
    } catch (error) {
        console.log(error.message);
        
    }
}


const addProductload = async (req,res)=>{
    try {

        const categoryData=await CatDB.find()

        res.render('add_products',{Catdata:categoryData})
    } catch (error) {
        console.log(error.message);
        
    }
}


const insertProduct = async (req,res)=>{
    try {

        const Data = new productdb({

            name:req.body.name,
            price:req.body.price,
            category:req.body.category,
            stock:req.body.stock,
            quantity:req.body.quantity,
            description:req.body.description,

            image:req.file.filename,

            blocked:false

        })
        const productdata =await Data.save()

        if(productdata){

            res.redirect('/admin/products')
        }else{
            res.render('add_products',{message:"error"})


        }     
    } catch (error) {
        console.log(error.message);
        
    }

}

const editProduct =async (req,res)=>{
    try {
        
        const id=req.query.id
    
        const editData=await productdb.findById({_id:id})
        const data =await CatDB.find()
       
        res.render('edit_products',{dataedit:editData,Catdata:data})

       

    } catch (error) {

        
    }
}
const posteditProduct = async(req,res)=>{
    try {
        console.log('ttttttt');

        const name = req.body.name;
        
       if(name.trim().length==0){
        res.redirect('/admin/products')

        console.log('hello');

       }else{

        console.log('working')
        const id = req.query.id
        console.log(id)

  const product=  await productdb.findByIdAndUpdate(id,{$set:{name:req.body.name,
        price:req.body.price,
        description:req.body.description,
        stock:req.body.stock,
        quantity:req.body.quantity,}})

        


        res.redirect('/admin/products')


      }
    } catch (error) {
        console.log(error.message);


        
    }

}

const deletetProduct =async (req,res)=>{
    try {
    

        const id=req.query.id
        await productdb.deleteOne({_id:id})
        res.redirect('/admin/products')
        
    } catch (error) {

        console.log(error.message);

        
    }

}

module.exports={

    productload,
    addProductload,
    insertProduct,
    editProduct,
    posteditProduct,
    deletetProduct,

}