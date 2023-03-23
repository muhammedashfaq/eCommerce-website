var mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/eCommerce')
const path =require('path')
const express=require("express")
const app=express()
const PORT=3000;

app.use(express.static(path.join(__dirname,'public')))



//for cache controll
app.use((req, res, next) => {
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
  });

//console.log(path.join(__dirname,'public'));
const userRout=require("./routes/user_routes")

app.use('/',userRout)


const adminRout=require("./routes/admin_routes")

app.use('/admin',adminRout)








app.listen(PORT,()=>{
    console.log(`server running on port no:${PORT}`);
})

