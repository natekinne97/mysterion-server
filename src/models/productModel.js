let mongoose = require('mongoose');

let ProductSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    price: Number
});

ProductSchema.index({ "$**": "text" });

module.exports = ProductSchema;