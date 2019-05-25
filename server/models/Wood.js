const mongoose = require("mongoose");

const WoodSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    unique: 1,
    maxlength: 100
  }
});

const Wood = mongoose.model("Wood", WoodSchema);

module.exports = { Wood };
