const User = require("../model/user_model");
const admin = require("../model/admin_model");
const CatDB = require("../model/category_Model");
const productdb = require("../model/prodect_model");
const user_address = require("../model/address_Model");
const productDB = require("../model/prodect_model");
const address_Model = require("../model/address_Model");

const getadd_address = async (req, res) => {
  try {
    const data = await productDB.find();
    const userd = await User.findOne({ _id: req.session.user_id });

    res.render("add_address", { product: data, user: userd.name });
  } catch (error) {
    console.log(error.message);
  }
};



const veryfyaddess =async(req,res)=>{
    try {

        const user = req.session.user_id;
    console.log(user);

    const userData = await User.findOne({ _id: req.session.user_id });
    console.log(userData);
    const dataaddress = await user_address.findOne({
      user: req.session.user_id,
    });
    console.log(dataaddress);
    if (dataaddress) {
      const update = await user_address.updateOne(
        { user: user },
        {
          $push: {
            address: {
              fname: req.body.fname,
              sname: req.body.sname,
              mobile: req.body.mobile,
              email: req.body.email,
              address: req.body.address,
              pin: req.body.pin,
            },
          },
        }
      );
      console.log(update);
      res.redirect("/user_profile");
      }else {
        const data = new user_address({
          user: userData._id,
          address: [
            {
              fname: req.body.fname,
              sname: req.body.sname,
              mobile: req.body.mobile,
              email: req.body.email,
              address: req.body.address,
              pin: req.body.pin,
            },
          ],
        });
        console.log('hellao');

        const addressData = await data.save();

        console.log(addressData);

        if (addressData) {
          res.redirect("/user_profile");
        } else {
          res.render("/add_address");
        }
      }
    

     
        
    } catch (error) {
        console.log(error.message);
        
    }
}






// const veryfyaddess1 = async (req, res) => {
//   try {
//     const user = req.session.user_id;
//     console.log(user);

//     const userData = await User.findOne({ _id: req.session.user_id });
//     console.log(userData);
//     const dataaddress = await user_address.findOne({
//       user: req.session.user_id,
//     });
//     console.log(dataaddress);
//     if (dataaddress) {
//       const update = await user_address.updateOne(
//         { user: user },
//         {
//           $push: {
//             address: {
//               fname: req.body.fname,
//               sname: req.body.sname,
//               mobile: req.body.mobile,
//               email: req.body.email,
//               address: req.body.address,
//               pin: req.body.pin,
//             },
//           },
//         }
//       );
//       console.log(update);
//       if (update) {
//         res.redirect("/checkout");
//       } else {
//         const data = new user_address({
//           user: userData._id,
//           address: [
//             {
//               fname: req.body.fname,
//               sname: req.body.sname,
//               mobile: req.body.mobile,
//               email: req.body.email,
//               address: req.body.address,
//               pin: req.body.pin,
//             },
//           ],
//         });

//         const addressData = await data.save();

//         if (addressData) {
//           res.redirect("/checkout");
//         } else {
//           res.render("/add_address");
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };













const deleteaddress = async (req, res) => {
  try {
    const id = req.body.id;


    await user_address.updateOne(
      { user: req.session.user_id },
      { $pull: { address: { _id: id } } }
    );
    res.json({remove:true})
  } catch (error) {
    console.log(error.message);
  }
};

const editaddress = async (req, res) => {
  try {
    const id = req.query.id;
    const userd = await User.findOne({ _id: req.session.user_id });
    // const addressData = await user_address.findOne({_id:userd});
    const userId = req.session.user_id
    // console.log(addressData);
    // const editData = await user_address.findOneAndUpdate({user : userId})
    console.log(id);
    // const value =editData



    const index=req.query.index
    console.log(index);
    const editData = await user_address.findOne({user : userId})

    const value=editData.address[index]

    console.log(value);


    res.render("edit_address", { user: userd.name, value });
  } catch (error) {
    console.log(error.message);
  }
};

//posteditaddress

const posteditaddress =async (req,res)=>{
  try {

      const fname=req.body.fname
      const sname =req.body.sname
      const mobile=req.body.mobile
      const email =req.body.email
      const address=req.body.address
      const pin =req.body.pin

    if(fname.trim().length==0 ||sname.trim().length==0 ||mobile.trim().length==0 
    ||email.trim().length==0 ||address.trim().length==0 ||pin.trim().length==0 ){ 
      res.redirect('/user_profile')
   }else{


    const dataeditaddress = await user_address.findOne({
      user: req.session.user_id,
    });
    console.log(dataeditaddress);
    if (dataeditaddress) {
      const update = await user_address.updateOne(
        { user: req.session.user_id },
        {
          $set: {
            address: {
              fname: req.body.fname,
              sname: req.body.sname,
              mobile: req.body.mobile,
              email: req.body.email,
              address: req.body.address,
              pin: req.body.pin,
            },
          },
        }
      );
      console.log(update);



   }

   res.redirect('/user_profile')



  }


  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  getadd_address,
  veryfyaddess,
  deleteaddress,
  editaddress,
  posteditaddress
};
