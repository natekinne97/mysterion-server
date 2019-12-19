const ObjectId = require("mongodb").ObjectID;
const Portfolio = require('../models/portfolioModel');

class PortfolioService {
  constructor(model) {
    this.model = model;
  }

  create(item) {
    let newItem = new this.model(item);
    return newItem.save();
  }

  findAll() {
    return this.model.find();
  }

  findById(id) {
    return this.model.findOne({ _id: ObjectId(id) });
  }

  deleteById(id) {
    return this.model.deleteOne({ _id: ObjectId(id) });
  }

  updateById(id, item) {
    const query = { _id: ObjectId(id) };
    const updateItem = {
      $set: { item }
    };
    return this.model.findOneAndUpdate(query, updateItem);
  }
}

module.exports = new PortfolioService(Portfolio);
