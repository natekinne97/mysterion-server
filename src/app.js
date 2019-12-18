require("dotenv").config();
// config file
const { NODE_ENV } = require('./config')
const express = require("express");
// loggers and error checkers
const morgan = require("morgan");
const helmet = require("helmet");
// cors
const cors = require("cors");
// db
const MongoClient = require('mongodb').MongoClient;
const app = express();
// import routes
const productRouter = require('./Product/Product');


const url = 'mongodb://localhost:27017/mysterion';

MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    console.log('database created');
    db.close();
}, { useUnifiedTopology: true });


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