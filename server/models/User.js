const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  lastname: {
    type: String,
    required: true,
    maxlength: 100
  },
  cart: {
    type: Array,
    default: []
  },
  history: {
    type: Array,
    default: []
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  }
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.generateToken = function(cb) {
  let user = this;
  let token = jwt.sign(user._id.toHexString(), process.env.SECRET);

  user.token = token;
  user
    .save()
    .then(user => cb(null, user))
    .catch(err => cb(err));
};

UserSchema.statics.findByToken = function(token, cb) {
  let user = this;

  jwt.verify(token, process.env.SECRET, function(err, decode) {
    user
      .findOne({ _id: decode, token: token })
      .then(user => cb(null, user))
      .catch(err => cb(err));
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = { User };
