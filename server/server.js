const express = require("express");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
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

  user.save((err, doc) => {
    if (err) {
      return res.json({ success: false, err });
    }
    res.status(200).json({ success: true, userdata: doc });
  });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
