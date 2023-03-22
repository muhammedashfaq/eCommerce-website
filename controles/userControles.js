const User= require("../model/user_model")


const registerLoad = async (re,res)=>{
    try {
        
        res.render("register")



    } catch (error) {
        console.log(error.message);
        
    }
}


const veryfiyUser= async (req,res)=>{
    try {
        const data =new User({
        name:req.body.name,
        email:req.body.email,
        mob:req.body.mob,
        password:req.body.password
    })

    const Udata = await data.save()
    
    if(Udata){
        res.render('login',{alert:'done'})
    }else{
        res.render('register',{alert:'note done'})

    }




        
    } catch (error) {

    console.log(error.message);
        
    }
}


const loadLogin=async (req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports={
    registerLoad,
    veryfiyUser,
    loadLogin
}

