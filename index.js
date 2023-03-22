var mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/eCommerce')
const path =require('path')
const express=require("express")
const app=express()
const PORT=8080;
app.use(express.static(path.join(__dirname,'public')))

//console.log(path.join(__dirname,'public'));
const userRout=require("./routes/user_routes")

app.use('/',userRout)








app.listen(PORT,()=>{
    console.log(`server running on port no:${PORT}`);
})

