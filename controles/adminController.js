const User= require("../model/user_model")
const bcrypt =require('bcrypt')

const getLogin=async (req,res)=>{
    try {
            res.render('login')

    } catch (error) {
        console.log(error.message);
        
    }
}


module.exports={
    getLogin
}


