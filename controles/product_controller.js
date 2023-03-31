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
        // const id=req.body.id

        const categoryData=await CatDB.find({blocked:false})


        res.render('add_products',{Catdata:categoryData})
    } catch (error) {
        console.log(error.message);
        
    }
}


const insertProduct = async (req,res)=>{
    try {
        const image=[];
        for(let i=0;i<req.files.length;i++){
            image[i]=req.files[i].filename
        }

        const Data = new productdb({

            name:req.body.name,
            price:req.body.price,
            category:req.body.category,
            stock:req.body.stock,
            quantity:req.body.quantity,
            description:req.body.description,

            image:image,

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
    
        const name = req.body.name;  
       if(name.trim().length==0){
        res.redirect('/admin/products')

       }else{
        const image=[];
        for(let i=0;i<req.files.length;i++){
            image[i]=req.files[i].filename
        }

        const id = req.query.id
        const product=  await productdb.findByIdAndUpdate(id,{$set:{name:req.body.name,
        price:req.body.price,
        description:req.body.description,
        category:req.body.category,
        stock:req.body.stock,
        quantity:req.body.quantity,}})
        const imageUpdate= await productdb.findByIdAndUpdate(id,{$push:{image:image}})

        if(product||imageUpdate){

            res.redirect('/admin/products')
    }else{
        res.render('eidt_products',{message:"edit failed"})

    }


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