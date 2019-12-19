const mongoose = require('mongoose');

let PortfolioSchema = new mongoose.Schema({
    image: String,
    company: String,
    review: String
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);