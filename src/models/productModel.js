const mongoose = require("mongoose");

let ProductSchema = new mongoose.Schema({
  image: String,
  title: String,
  description: String,
  price: Number
});

module.exports = mongoose.model("Product", ProductSchema);
