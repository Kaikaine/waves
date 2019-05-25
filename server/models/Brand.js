const mongoose = require("mongoose");

const BrandSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    unique: 1,
    maxlength: 100
  }
});

const Brand = mongoose.model("Brand", BrandSchema);

module.exports = { Brand };
