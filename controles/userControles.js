const User = require("../model/user_model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { getMaxListeners } = require("../model/user_model");
const randomstring = require("randomstring");
const productDB = require("../model/prodect_model");
const CatDB = require("../model/category_Model");
const cart = require("../model/cart_model");
const user_address = require("../model/address_Model");
const order = require("../model/order_Model");
const Razorpay = require("razorpay");
const coupon = require("../model/coupon_Mode");

let dotenv = require("dotenv");
dotenv.config();

let otp;
let email2;
let name2;

///html to pdfgenerate require things forpuchase invoice
// const ejs = require("ejs");
// const pdf = require("html-pdf");
// const fs = require("fs");
// const path = require("path");

var instance = new Razorpay({
  key_id: process.env.Razorid,
  key_secret: process.env.RazorKey,
});

///bcrypt password
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

//for send mail

const sendVerifymail = async (name, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
    });
    const mailOption = {
      from: "aspu17@gmail.com ",
      to: email,
      subject: "For OTP verification",
      //html:"<p> Hii  " +name+ "  please enter  " +otp+ "  as your OTP for verification </p>"
      // html:'<p>hi '+name+' ,please click here to<a href="http://localhost:3000/otp " '+email+' >varify</a> for verify and enter the '+otp+ ' </p>'
      html:
        "<p>hi" +
        name +
        ',please click here to<a href="http://localhost:3000/otp">varify</a> and enter the' +
        otp +
        " for your verification " +
        email +
        "</p>",
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error.message);
      } else {
        console.log("emai has been send to:", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};
//for reset password send mail

const resetsendVerifymail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
    });
    const mailOption = {
      from: process.env.email,
      to: email,
      subject: "For Reset password",
      //html:"<p> Hii  " +name+ "  please enter  " +otp+ "  as your OTP for verification </p>"
      // html:'<p>hi '+name+' ,please click here to<a href="http://localhost:3000/otp " '+email+' >varify</a> for verify and enter the '+otp+ ' </p>'
      html:
        "<p>hi " +
        name +
        ' ,please click here to<a href="http://localhost:3000/reset_password?token=' +
        token +
        '">Reset</a> your password </p>',
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error.message);
      } else {
        console.log("emai has been send to:", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

//otpLOad

const otpVerify = async (req, res) => {
  try {
    res.render("otp_verification");
  } catch (error) {
    console.log(error.message);
  }
};

//otp resend

const resend = async (req, res) => {
  try {
    //Generate a random 4-digit OTP
    const otpGenarated = Math.floor(1000 + Math.random() * 9999);
    otp = otpGenarated;

    sendVerifymail(name2, email2, otpGenarated);
    res.render("otp_verification");
  } catch (error) {
    console.log(error.message);
  }
};

//otpValidation

const otpValidation = async (req, res) => {
  try {
    const otpinput = req.body.otp;

    if (otpinput == otp) {
      await User.findOneAndUpdate(
        { email: email2 },
        { $set: { is_verified: 1 } }
      );

      res.render("login", { message: "success..!!!" });
    } else res.redirect("/otp");
  } catch (error) {
    console.log(error.message);
  }
};

//register page load

const registerLoad = async (re, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log(error.message);
  }
};

//register page insert user
const veryfiyUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const email = req.body.email;
    const name = req.body.name;
    const alreyMail = await User.findOne({ email: email });
    email2 = email;
    name2 = name;

    if (alreyMail) {
      res.render("register", { message: "EMAIL ALREADY EXIST " });
    } else {
      const data = new User({
        name: req.body.name,
        email: req.body.email,
        mob: req.body.mob,
        password: spassword,
        is_admin: 0,
        is_verified: 0,
        is_blocked: false,
      });

      const Udata = await data.save();

      if (Udata) {
        // Generate a random 4-digit OTP
        const otpGenarated = Math.floor(1000 + Math.random() * 9999);
        otp = otpGenarated;

        sendVerifymail(req.body.name, req.body.email, otpGenarated);
        res.render("otp_verification");
      } else {
        res.render("register", { alert: "registration not completed" });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

//login page
const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const veryfiLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });
    if(userData == null){
      res.redirect("/")
    }else if (userData.is_verified == 1) {
      if (userData.is_blocked == false) {
        if (userData.email) {
          const passwordMatch = await bcrypt.compare(
            password,
            userData.password
          );

          if (passwordMatch) {
            req.session.user_id = userData._id;
            res.redirect("/home");
          } else {
            res.render("login", { message: "Incorrect Email Or Password" });
          }
        } else {
          res.render("login", { message: "Incorrect Email Or Password" });
        }
      } else {
        res.render("login", { message: "Your Blocked..." });
      }
    } else {
      res.render("login", { message: "Your Not verified" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

///forget passwd

const forgetLoad = async (req, res) => {
  try {
    res.render("forget_password");
  } catch (error) {
    console.log(error.message);
  }
};

const forgetSendtoEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });
    if (userData) {
      if (userData.is_verified == 0) {
        res.render("forget_password", { message: "Email Not veryfied" });
      } else {
        const randomstrinG = randomstring.generate();

        const Updateddata = await User.updateOne(
          { email: email },
          { $set: { token: randomstrinG } }
        );
        const user = await User.findOne({ email: email });

        resetsendVerifymail(user.name, user.email, randomstrinG);

        res.render("forget_password", {
          message: "Please check your Mail for Reset your password",
        });
      }
    } else {
      res.render("forget_password", { message: "Wrong Email Id" });
    }
  } catch (error) {
    console.log(error.messages);
  }
};

const resetpassLoad = async (req, res) => {
  try {
    const token = req.query.token;
    const userData = await User.findOne({ token: token });
    if (userData) {
      res.render("reset_password", { email: userData.email });
    } else {
      res.render("404", { message: "Invlaid Token" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const resetpassverify = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;

    const spassword = await securePassword(password);

    const updatedData = await User.findOneAndUpdate(
      { email: email },
      { $set: { password: spassword, token: "" } }
    );

    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};
const getHome = async (req, res) => {
  try {
    const data = await productDB.find();
    const userd = await User.findOne({ _id: req.session.user_id });

    res.render("home", { product: data, user: userd.name });
  } catch (error) {
    console.log(error.message);
  }
};

const userLogout = async (req, res) => {
  try {
    req.session.user_id = false;
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};
const getShop = async (req, res) => {
  try {
    let page = req.query.page || 1;
    const limit = 3;
    const skip = (page - 1) * limit;

    let search = req.query.search || "";

    let category = req.query.category || "All";

    let cat = [];
    const categoryData = await CatDB.find();
    for (let i = 0; i < categoryData.length; i++) {
      cat[i] = categoryData[i].name;
    }
    category == "All"
      ? (category = [...cat])
      : (category = req.query.category.split(","));

    let sort;
    let price = req.query.price || "Low";
    price == "Low" ? (sort = 1) : (sort = -1);
    const productData = await productDB.aggregate([
      {
        $match: {
          name: { $regex: "^" + search, $options: "i" },
          category: { $in: [...category] },
        },
      },
      { $sort: { price: sort } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const productCount = (
      await productDB
        .find({ name: { $regex: "^" + search, $options: "i" } })
        .where("category")
        .in([...category])
    ).length;

    const totalpages = Math.ceil(productCount / limit);
    const userd = await User.findOne({ _id: req.session.user_id });
    res.render("shop", {
      product: productData,
      user: userd.name,
      totalpages,
      page,
      categoryData,
      price,
      category,
      search,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getContact = async (req, res) => {
  try {
    res.render("contact");
  } catch (error) {
    console.log(error.message);
  }
};

const getAbout = async (req, res) => {
  try {
    res.render("about");
  } catch (error) {
    console.log(error.message);
  }
};

const getCart = async (req, res) => {
  try {
    // const data =await productDB.find()
    const userd = await User.findOne({ _id: req.session.user_id });
    const id = req.session.user_id;
    const cartData = await cart
      .findOne({ user: req.session.user_id })
      .populate("product.productId");

    if (cartData) {
      const products = cartData.product;

      if (products.length > 0) {
        const total = await cart.aggregate([
          { $match: { user: userd._id } },

          { $unwind: "$product" },

          {
            $project: {
              price: "$product.price",
              quantity: "$product.quantity",
            },
          },

          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ["$price", "$quantity"] } },
            },
          },
        ]);

        const Total = total[0].total;

        const useRID = userd._id;

        res.render("cart", {
          user: userd.name,
          products: products,
          Total,
          useRID,
        });
      } else {
        res.render("cart", { user: userd.name, products: undefined });
      }
    } else {
      res.render("cart", { user: userd.name });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const addtoCart = async (req, res) => {
  try {
    const productId = req.body.id;

    const UserId = await User.findOne({ _id: req.session.user_id });
    // console.log('sfegreg'+email);
    // const userData=await User.findOne({_id:email})
    // const UserId =userData._id
    // console.log(UserId);

    //database checking
    const productData = await productDB.findById(productId);
    const Usercart = await cart.findOne({ user: UserId });

    if (Usercart) {
      //checking cart prodcut avaliable
      const productavaliable = await Usercart.product.findIndex(
        (product) => product.productId == productId
      );
      if (productavaliable != -1) {
        //if have product in cart the qnty increse
        await cart.findOneAndUpdate(
          { user: UserId, "product.productId": productId },
          { $inc: { "product.$.quantity": 1 } }
        );
        res.json({ success: true });
      } else {
        //if no product in cart add product
        await cart.findOneAndUpdate(
          { user: UserId },
          {
            $push: {
              product: { productId: productId, price: productData.price },
            },
          }
        );
        res.json({ success: true });
      }
    } else {
      const CartData = new cart({
        user: UserId._id,
        product: [
          {
            productId: productId,
            price: productData.price,
          },
        ],
      });
      const cartData = await CartData.save();
      if (cartData) {
        res.json({ success: true });
      } else {
        res.redirect("/home");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getProduct_details = async (req, res) => {
  try {
    const id = req.query.id;

    const prodata = await productDB.findById({ _id: id });
    const userd = await User.findOne({ _id: req.session.user_id });

    res.render("product_details", { product: prodata, user: userd.name });
  } catch (error) {
    console.log(error.message);
  }
};

const getProduct_checkout = async (req, res) => {
  try {
    const address = await user_address.findOne({ user: req.session.user_id });
    const data = await productDB.find();
    const userd = await User.findOne({ _id: req.session.user_id });
    const cartData = await cart
      .findOne({ user: userd._id })
      .populate("product.productId");
    const total = await cart.aggregate([
      { $match: { user: userd._id } },

      { $unwind: "$product" },

      { $project: { price: "$product.price", quantity: "$product.quantity" } },

      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]);

    const Total = total[0].total;

    if (address) {
      if (cartData.product.length > 0) {
        const addressData = address.address;

        const Total = total[0].total;
        const grandTotal = total[0].total;
        res.render("checkout", {
          product: data,
          Total,
          userd,
          user: userd.name,
          address: addressData,
          grandTotal,
        });
      } else {
        res.render("checkout", {
          product: data,
          Total,
          userd,
          user: userd.name,
          address: addressData,
        });
      }
    } else {
      res.render("checkout", { product: data, userd, user: userd.name, Total });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const walamount = async (req, res) => {
  try {
    const user = req.session.user_id;
    const wal = req.body.wal;
    const grandTotals = req.body.gtotal;
    const subtotals = req.body.stotlal;
    const userd = await User.findOne({ _id: user });
    const twallet = userd.wallet;

    if (userd.wallet >= wal) {
      const grandtotal = subtotals - wal;
      res.json({ success: true, grandtotal, wal, twallet });
    } else {
      res.json({ limit: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

var cpn;

const placetheorder = async (req, res) => {
  try {
    const userd = await User.findOne({ _id: req.session.user_id });
    const total = await cart.aggregate([
      { $match: { user: userd._id } },

      { $unwind: "$product" },

      { $project: { price: "$product.price", quantity: "$product.quantity" } },

      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]);

    const Total = total[0].total;

    const Total1 = req.body.amount;
    const subtotal = req.body.total;
    const wallet1 = req.body.wallet;
    //const pricetotal=totalPrice
    // const discount = parseInt(req.body.discount);

    const address = req.body.address;
    const payment = req.body.payment;
    const exprdate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    // const userData = req.session.user_id
    const userDetails = await User.findOne({ _id: req.session.user_id });
    const cartData = await cart.findOne({ user: userDetails._id });
    const products = cartData.product;
    const couponamt = req.body.coupon;
    const grandToatal = subtotal - userDetails.wallet;
    const wallet = req.body.wallet;

    const status = payment === "COD" ? "placed" : "pending";

    const newOrder = new order({
      deliveryDetails: address,
      user: userDetails._id,
      userName: userDetails.name,
      paymentMethod: payment,
      product: products,
      totalAmount: Total1,
      subtotal: subtotal,
      Date: Date.now(),
      exprdate: exprdate,
      status: status,
      orderWallet: wallet,
      ordercoupon: couponamt,
    });

    const saveOrder = await newOrder.save();
    if (status == "placed") {
      const wal = subtotal - Total1 - couponamt;

      console.log(wal + "wallet");

      // const code =req.session.code
      // const couponData = await coupon.find({code:code})

      // if(couponData){
      //     await coupon.findByIdAndUpdate({_id:couponData._id},{$push:{user:req.session.user_id}});
      //      await coupon.findByIdAndUpdate({_id:couponData._id},{$inc:{maxUsers:-1}});
      //      await User.updateOne({_id:req.session.user_id},{$inc:{wallet:-wal}});
      //      await cart.deleteOne({user:userDetails._id})
      //      res.json({codsuccess:true})

      // }else{
      await User.updateOne(
        { _id: req.session.user_id },
        { $inc: { wallet: -wal } }
      );
      await cart.deleteOne({ user: userDetails._id });
      res.json({ codsuccess: true });
    } else {
      const orderid = saveOrder._id;
      const couponAmt = saveOrder.ordercoupon;
      cpn = couponAmt;
      const totalamount = saveOrder.totalAmount;
      var options = {
        amount: totalamount * 100,
        currency: "INR",
        receipt: "" + orderid,
      };
      instance.orders.create(options, function (err, order) {
        res.json({ order });
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const orderplaced = async (req, res) => {
  try {
    const userd = await User.findOne({ _id: req.session.user_id });

    res.render("order_success", { user: userd.name });
  } catch (error) {
    console.log(error.message);
  }
};

///verifyOnlinePayment

const verifyOnlinePayment = async (req, res) => {
  try {
    const userd = await User.findOne({ _id: req.session.user_id });

    const stotal = await cart.aggregate([
      { $match: { user: userd._id } },

      { $unwind: "$product" },

      { $project: { price: "$product.price", quantity: "$product.quantity" } },

      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]);

    const subtotal = stotal[0].total;

    const total = req.body.amount;
    const couponamt = cpn;
    console.log(total);
    console.log(couponamt);

    const wal = subtotal - total - couponamt;

    console.log(wal + "online wallet");
    const details = req.body;
    const crypto = require("crypto");
    let hmac = crypto.createHmac("sha256", process.env.RazorKey);
    hmac.update(
      details.payment.razorpay_order_id +
        "|" +
        details.payment.razorpay_payment_id
    );

    hmac = hmac.digest("hex");

    if (hmac == details.payment.razorpay_signature) {
      await User.updateOne(
        { _id: req.session.user_id },
        { $inc: { wallet: -wal } }
      );
      await order.findByIdAndUpdate(
        { _id: details.order.receipt },
        { $set: { status: "placed" } }
      );
      await order.findByIdAndUpdate(
        { _id: details.order.receipt },
        { $set: { paymentId: details.payment.razorpay_payment_id } }
      );
      await cart.deleteOne({ user: req.session.user_id });
      res.json({ success: true });
    } else {
      await order.findByIdAndRemove({ _id: details.order.receipt });
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//deletcartitem

const deletcartitem = async (req, res) => {
  try {
    let id = req.body.product;
    await cart.findOneAndUpdate(
      { "product.productId": id },
      { $pull: { product: { productId: id } } }
    );
    res.json({ remove: true });
  } catch (error) {
    console.log(error.message);
  }
};

const cartquantity = async (req, res, next) => {
  try {
    let cartId = req.body.cart;
    const proId = req.body.product;
    let quantity = req.body.quantity;

    let count = req.body.count;

    if (count == -1 && quantity == 1) {
      res.json({ remove: true });
    } else {
      await cart.updateOne(
        { user: req.session.user_id, "product.productId": proId },
        { $inc: { "product.$.quantity": count } }
      );
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};

const totalproductprice = async (req, res) => {
  try {
    const userd = await User.findOne({ _id: req.session.user_id });

    let total = await cart.aggregate([
      {
        $match: {
          user: userd._id,
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          price: "$product.price",
          quantity: "$product.quantity",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]);

    let Total = total[0].total;

    res.json({ success: true, Total });
  } catch (error) {
    res.render("user/500");
  }
};

///// BUY NOW SECTION

var productId;
const buynow = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.session.user_id });
    req.session.wallet = user.wallet;
    const id = req.body.id;
    productId = id;
    console.log(id);

    const prodcut = await productDB.findById({ _id: id });

    const Total = prodcut.price;
    console.log(prodcut);
    console.log(Total);

    if (prodcut) {
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const buynowrender = async (req, res) => {
  try {
    const address = await user_address.findOne({ user: req.session.user_id });
    const addressData = address.address;

    const user = await User.findOne({ _id: req.session.user_id });
    const id = req.body.id;

    const prodcut = await productDB.findById({ _id: productId });

    console.log(productId);

    const Total = prodcut.price;
    const grandTotal = prodcut.price;

    if (prodcut) {
      res.render("checkoutbuy", {
        prodcut,
        Total,
        userw: req.session.wallet,
        user: user.name,
        address: addressData,
        grandTotal,
      });
    } else {
      res.render("checkoutbuy", {
        prodcut,
        Total,
        userw: req.session.wallet,
        user: user.name,
        address: addressData,
      });
    }
  } catch (error) {}
};

var cpnamt;

const placetheorderbuy = async (req, res) => {
  try {
    const userd = await User.findOne({ _id: req.session.user_id });

    const prodcutdata = await productDB.findById({ _id: productId });
    const products = prodcutdata.product;

    const Total = prodcutdata.price;

    const couponamt = req.body.coupon;
    cpnamt = couponamt;
    const address = req.body.address;
    const payment = req.body.payment;
    const grandTotal = req.body.amount;
    const exprdate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    // const userData = req.session.user_id
    const userDetails = await User.findOne({ _id: req.session.user_id });

    const status = payment === "COD" ? "placed" : "pending";

    const newOrder = new order({
      deliveryDetails: address,
      user: userDetails._id,
      userName: userDetails.name,
      paymentMethod: payment,
      product: [{ productId: prodcutdata._id, quantity: 1 }],
      totalAmount: Total,
      Date: Date.now(),
      exprdate: exprdate,
      status: status,
      ordercoupon: couponamt,
    });

    const saveOrder = await newOrder.save();
    if (status == "placed") {
      const wal = Total - grandTotal - couponamt;
      await User.updateOne(
        { _id: req.session.user_id },
        { $inc: { wallet: -wal } }
      );
      res.json({ codsuccess: true });
    } else {
      const orderid = saveOrder._id;
      const totalamount = saveOrder.totalAmount;
      var options = {
        amount: totalamount * 100,
        currency: "INR",
        receipt: "" + orderid,
      };
      instance.orders.create(options, function (err, order) {
        res.json({ order });
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

///verifyOnlinePayment

const verifyBuynowPayment = async (req, res) => {
  try {
    const subtotal = req.body.amount2;
    const total = req.body.amount;
    // const wal = totalPrice - total;
    const details = req.body;
    console.log(details);
    const crypto = require("crypto");
    let hmac = crypto.createHmac("sha256", process.env.RazorKey);
    hmac.update(
      details.payment.razorpay_order_id +
        "|" +
        details.payment.razorpay_payment_id
    );

    hmac = hmac.digest("hex");
    console.log(hmac);

    console.log(details.payment.razorpay_signature);

    if (hmac == details.payment.razorpay_signature) {
      const wal = subtotal - total - cpnamt;

      await User.updateOne(
        { _id: req.session.user_id },
        { $inc: { wallet: -wal } }
      );

      await order.findByIdAndUpdate(
        { _id: details.order.receipt },
        { $set: { status: "placed" } }
      );
      await order.findByIdAndUpdate(
        { _id: details.order.receipt },
        { $set: { paymentId: details.payment.razorpay_payment_id } }
      );
      res.json({ success: true });
    } else {
      await order.findByIdAndRemove({ _id: details.order.receipt });
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error.message);
  }
};

///// END BUY NOW SECTION

const error404 = async (req, res) => {
  try {
    res.render("404");
  } catch (error) {
    console.log(error.message);
  }
};

const getUser_profile = async (req, res) => {
  try {
    const address = await user_address.findOne({ user: req.session.user_id });
    const coupon1 = await coupon.find();
    const userd = await User.findOne({ _id: req.session.user_id });
    const userData = await User.findOne({ _id: req.session.user_id });

    if (address) {
      res.render("user_profile", {
        user: userd.name,
        data: userData,
        address,
        coupon1,
      });
    } else {
      res.render("user_profile", { user: userd.name, data: userData });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//postprofilesubmit

const postprofilesubmit = async (req, res) => {
  try {
    console.log("assss");

    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;

    if (
      name.trim().length == 0 ||
      email.trim().length == 0 ||
      mobile.trim().length == 0
    ) {
      res.redirect("/user_profile");
    } else {
      console.log("alred");

      const alreyMail = await User.findOne({ email: email });
      if (alreyMail) {
        await User.updateOne(
          { _id: req.session.user_id },
          {
            $set: {
              name: name,
              mob: mobile,
            },
          }
        );
        res.redirect("/user_profile");
      } else {
        console.log("update");

        const data = await User.updateOne(
          { _id: req.session.user_id },
          {
            $set: {
              name: name,
              email: email,
              mob: mobile,
            },
          }
        );
        console.log(data);
        res.redirect("/user_profile");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const orderlistLoad = async (req, res) => {
  try {
    const userd = await User.findOne({ _id: req.session.user_id });

    // const orders=await order.findOne({user:userd})
    const orders = await order.find({ user: userd._id }).sort({ _id: -1 });

    res.render("order_list", { user: userd.name, orders });
  } catch (error) {
    console.log(error.message);
  }
};
const ordershowLoad = async (req, res) => {
  try {
    const userd = await User.findOne({ _id: req.session.user_id });
    const id = req.query.id;

    const orderData = await order
      .findById({ _id: id })
      .populate("product.productId");
    const product = orderData.product;
    res.render("order_list_show", { user: userd.name, product, orderData });
  } catch (error) {
    console.log(error.message);
  }
};

//canceluserorder
const canceluserorder = async (req, res) => {
  try {
    const id = req.body.id;
    const orderdata = await order.findById({ _id: id });

    const wallet = orderdata.orderWallet;

    const total = orderdata.totalAmount + wallet - orderdata.ordercoupon;

    //const userd=await User.findOne({_id:req.session.user_id})
    const data = await order.findByIdAndUpdate(
      { _id: id },
      { $set: { status: "canceled" } }
    );
    if (data) {
      if (orderdata.paymentMethod == "COD") {
        await User.findByIdAndUpdate(orderdata.user, {
          $inc: { wallet: wallet },
        });
      } else {
        await User.findByIdAndUpdate(orderdata.user, {
          $inc: { wallet: total },
        });
      }

      res.json({ remove: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

///returnuserorder

const returnuserorder = async (req, res) => {
  try {
    const userd = await User.findOne({ _id: req.session.user_id });
    const id = req.body.id;
    const date = await order.findById({ _id: id });
    console.log(date.exprdate);
    if (Date.now() > date.exprdate) {
      res.json({ datelimit: true });
    } else {
      await order.updateOne(
        { _id: id },
        { $set: { status: "waiting for approval" } }
      );

      res.json({ return: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// const orderInvoice = async (req, res) => {
//   try {
//     const id = req.query.id;

//     const orderdetails = await order
//       .findOne({ _id: id })
//       .populate("product.productId")
//       .sort({ Date: -1 });

//     const orderData = orderdetails.product;

//     console.log(orderdetails);

//     const data = {
//       report: orderdetails,
//       data: orderData,
//     };

//     const filepath = path.resolve(__dirname, "../views/users/invoicepdf.ejs");
//     const htmlstring = fs.readFileSync(filepath).toString();

//     let option = {
//       format: "A3",
//     };
//     const ejsData = ejs.render(htmlstring, data);
//     pdf.create(ejsData, option).toFile("Invoice.pdf", (err, response) => {
//       if (err) console.log(err);

//       const filepath = path.resolve(__dirname, "../invoice.pdf");
//       fs.readFile(filepath, (err, file) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).send("could not download file");
//         }
//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader(
//           "Content-Disposition",
//           'attatchment;filename="Purchase Invoice.pdf"'
//         );

//         res.send(file);
//       });
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

module.exports = {
  registerLoad,
  veryfiyUser,
  otpVerify,
  resend,
  loadLogin,
  veryfiLogin,
  forgetLoad,
  forgetSendtoEmail,
  resetpassLoad,
  resetpassverify,
  getHome,
  getCart,
  addtoCart,
  getProduct_details,
  getProduct_checkout,
  walamount,
  placetheorder,
  orderplaced,
  verifyOnlinePayment,
  deletcartitem,
  cartquantity,
  totalproductprice,
  buynow,
  placetheorderbuy,
  verifyBuynowPayment,
  userLogout,
  getShop,
  getContact,
  getAbout,
  buynowrender,
  otpValidation,
  error404,
  getUser_profile,
  postprofilesubmit,
  orderlistLoad,
  ordershowLoad,
  canceluserorder,
  returnuserorder
  // orderInvoice,
};
