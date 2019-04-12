const express = require("express");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require("dotenv").config();

// MODELS
const { User } = require("./models/User");

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.unsubscribe(cookieparser());

// USERS

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
        res.status(200).json({ success: true, userdata: doc });
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

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
