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

const veryfyaddess = async (req, res) => {
  try {
    const user = req.session.user_id;

    const userData = await User.findOne({ _id: req.session.user_id });
    const dataaddress = await user_address.findOne({
      user: req.session.user_id,
    });
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
      res.redirect("/user_profile");
    } else {
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

      const addressData = await data.save();

      if (addressData) {
        res.redirect("/user_profile");
      } else {
        res.render("/add_address");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const deleteaddress = async (req, res) => {
  try {
    const id = req.body.id;

    await user_address.updateOne(
      { user: req.session.user_id },
      { $pull: { address: { _id: id } } }
    );
    res.json({ remove: true });
  } catch (error) {
    console.log(error.message);
  }
};

const editaddress = async (req, res) => {
  try {
    const id = req.query.id;
    const userd = await User.findOne({ _id: req.session.user_id });
    const userId = req.session.user_id;
    const index = req.query.index;
    const editData = await user_address.findOne({ user: userId });
    const value = editData.address[index];
    res.render("edit_address", { user: userd.name, value, index });
  } catch (error) {
    console.log(error.message);
  }
};

//posteditaddress

const posteditaddress = async (req, res) => {
  try {
    const index = req.body.index;
    const fname = req.body.fname;
    const sname = req.body.sname;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const address = req.body.address;
    const pin = req.body.pin;

    if (
      fname.trim().length == 0 ||
      sname.trim().length == 0 ||
      mobile.trim().length == 0 ||
      email.trim().length == 0 ||
      address.trim().length == 0 ||
      pin.trim().length == 0
    ) {
      res.redirect("/user_profile");
    } else {
      const dataeditaddress = await user_address.findOne({
        user: req.session.user_id,
      });
      if (dataeditaddress) {
        const update = await user_address.updateOne(
          { user: req.session.user_id },
          {
            $set: {
              [`address.${index}`]: {
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
      }

      res.redirect("/user_profile");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//addaddress chechout
const veryfyaddesscheck = async (req, res) => {
  try {
    const user = req.session.user_id;

    const userData = await User.findOne({ _id: req.session.user_id });
    const dataaddress = await user_address.findOne({
      user: req.session.user_id,
    });
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
      res.redirect("/checkout");
    } else {
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

      const addressData = await data.save();

      if (addressData) {
        res.redirect("/checkout");
      } else {
        res.render("/add_address");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};


const posteditaddresscheck = async (req, res) => {
  try {
    const index = req.body.index;
    const fname = req.body.fname;
    const sname = req.body.sname;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const address = req.body.address;
    const pin = req.body.pin;

    if (
      fname.trim().length == 0 ||
      sname.trim().length == 0 ||
      mobile.trim().length == 0 ||
      email.trim().length == 0 ||
      address.trim().length == 0 ||
      pin.trim().length == 0
    ) {
      res.redirect("/user_profile");
    } else {
      const dataeditaddress = await user_address.findOne({
        user: req.session.user_id,
      });
      if (dataeditaddress) {
        const update = await user_address.updateOne(
          { user: req.session.user_id },
          {
            $set: {
              [`address.${index}`]: {
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
      }

      res.redirect("/checkout");
    }
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  getadd_address,
  veryfyaddess,
  deleteaddress,
  editaddress,
  posteditaddress,
  veryfyaddesscheck,
  posteditaddresscheck,
};
