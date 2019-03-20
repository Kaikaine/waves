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

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
