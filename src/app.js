require("dotenv").config();
// config file
const { NODE_ENV, DBURL } = require('./config')
const express = require("express");
// loggers and error checkers
const morgan = require("morgan");
const helmet = require("helmet");
// cors
const cors = require("cors");
// db
const mongoose = require('mongoose');
const app = express();
// import routes
const productRouter = require('./Product/Product');

let url;
if(NODE_ENV === 'test'){
    console.log('in testing mode');
}

mongoose.connect(
  DBURL,
  { useUnifiedTopology: true, useNewUrlParser: true },
  function(err) {
    if (err) {
      console.log(err, "error in connecting to mongo");
    } else {
      console.log("connected to mongo at: ", DBURL);
    }
  }
);

// logger
app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
}))

// logger and cors
app.use(cors({
    credentials: true,
}))

app.use(helmet())

// use routes
app.use('/api/product', productRouter);

// catch all error handler
app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: 'Server error' }
    } else {
        console.error(error)
        response = { error: error.message, object: error }
    }
    res.status(500).json(response)
})


module.exports = app;