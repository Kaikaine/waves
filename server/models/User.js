const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

// UserSchema.pre("save", next => {
//   let user = this;
//   console.log(user);
//   bcrypt.genSalt((err, salt) => {
//     if (err) return next(err);

//     bcrypt.hash(this.password, salt, (err, hash) => {
//       if (err) return next(err);

//       this.password = hash;
//       next();
//     });
//   });
// });

const User = mongoose.model("User", UserSchema);

module.exports = { User };
