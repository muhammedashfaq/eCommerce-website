

var mongoose=require('mongoose')
const mongoDB =require('./config/auth')

mongoDB.mongoDB()
const path =require('path')
const express=require("express")
const app=express()
const PORT=3000;


app.set('view engine','ejs')
app.set('views','./views/users')


//for cache controll
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

//static folder
app.use(express.static(path.join(__dirname,'public')))



//console.log(path.join(__dirname,'public'));
const userRout=require("./routes/user_routes")

app.use('/',userRout)


const adminRout=require("./routes/admin_routes")

app.use('/admin',adminRout)



app.use((req,res)=>{
   res.status(404).render("404")
  })
  
  

app.listen(PORT,()=>{
    console.log(`server running on port no:${PORT}`);
})

