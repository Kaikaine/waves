const express = require("express");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require("dotenv").config();

// MODELS
const { User } = require("./models/User");
const { Brand } = require("./models/Brand");
const { Wood } = require("./models/Wood");
const { Product } = require("./models/Product");

// MIDDLEWARES
const { auth } = require("./middleware/auth");
const { admin } = require("./middleware/admin");

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieparser());

//=========================
//            USERS
//=========================

// route    GET api/users/auth
// desc     authenticate a user
// access   private
app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    cart: req.user.cart,
    history: req.user.history
  });
});

// route    POST api/users/register
// desc     register a user
// access   public
app.post("/api/users/register", (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    lastname: req.body.lastname
  });

  let salt_i = 10;

  bcrypt.genSalt(salt_i, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;

      user.save((err, doc) => {
        if (err) {
          return res.json({ success: false, err: err });
        }
        res.status(200).json({
          success: true
          // userdata: doc
        });
      });
    });
  });
});

// route    POST api/users/login
// desc     login a user
// access   public
app.post("/api/users/login", (req, res) => {
  // find email
  User.findOne({ email: req.body.email })
    .then(user => {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          return res.json({
            loginSuccess: false,
            message: "incorrect password"
          });
        }
        user.generateToken((err, user) => {
          if (err) return res.json(404).send(err);
          res
            .cookie("w_auth", user.token)
            .status(200)
            .json({
              loginSuccess: true
            });
        });
      });
    })
    .catch(err =>
      res.json({ loginSuccess: false, message: "Email not found" })
    );
  // check password

  // generate token
});

// route    GET api/users/logout
// desc     authenticate a user
// access   private
app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    });
  });
});

//=========================
//            WOODS
//=========================

// route    GET /api/product/wood
// desc     get all woods
// access   private
app.get("/api/product/woods", (req, res) => {
  Wood.find({})
    .then(wood => res.status(200).json({ success: true, wood }))
    .catch(err => res.status(400).json({ success: false, err }));
});

// route    POST /api/product/wood
// desc     create a wood
// access   private
app.post("/api/product/wood", auth, admin, (req, res) => {
  const wood = new Wood(req.body);

  wood
    .save()
    .then(wood => res.status(200).json({ success: true, wood }))
    .catch(err => res.status(400).json({ success: false, err }));
});

//=========================
//            BRAND
//=========================

// route    GET /api/product/brands
// desc     find all brands
// access   private
app.get("/api/product/brands", (req, res) => {
  Brand.find({})
    .then(brand => res.status(200).json({ success: true, brand }))
    .catch(err => res.status(400).json({ success: false, err }));
});

// route    POST /api/product/brand
// desc     create a brand
// access   private
app.post("/api/product/brand", auth, admin, (req, res) => {
  const brand = new Brand(req.body);

  brand
    .save()
    .then(brand => res.status(200).json({ success: true, brand }))
    .catch(err => res.json({ success: false, err }));
});

//=========================
//            PRODUCTS
//=========================
// route    GET /api/product/articles?sortBy=sold&order=desc&limit=4 / /api/product/articles?sortBy=createAt&order=desc&limit=4
// desc     get products by amount sold
// access   private
app.get("/api/product/articles", (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;

  Product.find()
    .populate("brand")
    .populate("wood")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec()
    .then(articles => res.status(200).json({ articles }))
    .catch(err => res.status(400).json({ err }));
});

// route    GET /api/product/articles_by_id?id=
// desc     get a product by id
// access   private
app.get("/api/product/articles_by_id", (req, res) => {
  let type = req.query.type;
  let items = req.query.id;

  if (type === "array") {
    let ids = req.query.id.split(",");
    items = [];
    items = ids.map(item => {
      return mongoose.Types.ObjectId(item);
    });

    Product.find({ _id: { $in: items } })
      .populate("brand")
      .populate("wood")
      .exec()
      .then(products => res.status(200).json(products))
      .catch(err => res.json({ err }));
  }
});

// route    POST /api/product/article
// desc     create a product
// access   private
app.post("/api/product/article", auth, admin, (req, res) => {
  const product = new Product(req.body);

  product
    .save()
    .then(product => res.status(200).json({ success: true, product }))
    .catch(err => res.json({ success: false, err }));
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
