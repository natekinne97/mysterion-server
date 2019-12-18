const express = require('express');
const jsonBodyParser = express.json();
const { DBURL } = require("../config");
const ObjectId = require("mongodb").ObjectId; 
const xss = require('xss');
// db
const MongoClient = require('mongodb').MongoClient;
const productRouter = express.Router();

// get product by id
productRouter.route('/:id')
    .get((req, res, next)=>{
        const id = req.params.id;
        console.log(id, 'id');
        
        // connect to db
        MongoClient.connect(DBURL, (err, db)=>{
             let dbo = db.db("mysterion");

             const query = {"_id": ObjectId(id)};
            // search collection
             dbo
               .collection("product")
               .find(query)
               .toArray((err, result)=>{
                if(err){
                    console.log(err, 'error');
                    res.status(400).json({
                        error: "Error occured in retrieving element"
                    })
                }
                 if (!result) {
                   return res
                     .status(400)
                     .json({
                       error: "Item not found!"
                     })
                     .end();
                 }
                db.close();
                return res.status(200).json(result).end();

               });
        })
    });

// get all products
productRouter.route('/')
    .get((req, res, next)=>{
        // connect to server
        MongoClient.connect(DBURL, (err, db)=>{
            let dbo = db.db('mysterion');
            dbo.collection('product')
            .find({})
            .toArray((err, result)=>{
                if(err){
                    return res.status(400).json({
                        error: "Something went wrong."
                    }).end();
                }
                 if (!result) {
                   return res
                     .status(400)
                     .json({
                       error: "Item not found!"
                     })
                     .end();
                 }
                db.close();
                return res.status(200).json(result);
            });
        });
    });

// update an element
productRouter.route('/:id')
    .patch(jsonBodyParser,(req, res, next)=>{
        const { image, title, description, price } = req.body;
        const id = req.params.id;
        const updatedProduct = {
          image: xss(image),
          title: xss(title),
          description: xss(description),
          price: price
        };

        // check for missing keys
        for (const key of Object.keys(updatedProduct)) {
          if (!updatedProduct[key]) {
            return res
              .status(400)
              .json({
                error: `Missing key in ${key}`
              })
              .end();
          }
        }

        // check if only spaces were sent
        // check if there are characters
        for (const key of Object.keys(updatedProduct)) {
          if (/^ *$/.test(updatedProduct[key])) {
            // It has only spaces, or is empty
            return res
              .status(400)
              .json({
                error: "Input is only spaces. Must include characters!"
              })
              .end();
          }
        }

        // connect to client
        MongoClient.connect(DBURL, (err, db)=>{
            if(err){
                return res.status(400).json({
                    error: "Something went wrong connecting to db"
                }).end();
            }
            const query = { _id: ObjectId(id) };
            const setProduct = {$set: {updatedProduct}}
             // ensure its mysterion
            let dbo = db.db('mysterion');
            
            dbo.collection('product')
                .findOneAndUpdate(query, setProduct, (err, result)=>{
                    if(err){
                       
                        return res.status(400).json({
                            error: "Could not find product"
                        }).end();
                    }

                    if(!result){
                        return res.status(400).json({
                            error: "Item not found!"
                        }).end();
                    }

                    return res.status(200).json(result.value);
                });

        });

    })

// get all from product collection
productRouter.route('/')
    .post(jsonBodyParser,(req, res, next)=>{
        const {image, title, description, price} = req.body;

        const newProduct = {
            image: xss(image),
            title: xss(title),
            description: xss(description),
            price: price
        }

        // check for missing keys
        for(const key of Object.keys(newProduct)){
            if(!newProduct[key]){
               return res
                 .status(400)
                 .json({
                   error: `Missing key in ${key}`
                 })
                 .end();
            }
        }

        // check if only spaces were sent
        // check if there are characters 
        for (const key of Object.keys(newProduct)) {
            if (/^ *$/.test(newProduct[key])) {
                // It has only spaces, or is empty
                return res.status(400).json({
                    error: "Input is only spaces. Must include characters!"
                }).end();
            }
        }

        // connect to the client
        MongoClient.connect(DBURL, (err, db)=>{
            if(err) throw err;
            // ensure its mysterion
            let dbo = db.db('mysterion');
            
            // insert to collection
            dbo.collection('product').insertOne(newProduct, (err, result)=>{
                if(err)throw err;
                console.log('something was inserted');
                db.close();
                console.log(result, 'result');
                res.json(result.ops);
            });
        });
    });


// delete product
productRouter.route('/:id')
    .delete((req, res, next)=>{
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        MongoClient.connect(DBURL, (err, db)=>{
            if(err){
                return res.status(400).json({
                    error: "Error in connecting to db"
                }).end();
            }
            let dbo = db.db('mysterion');

            dbo.collection('product')
                .deleteOne(query, (err, result)=>{
                    if(err){
                        return res.status(400).json({
                            error: "Error occured in deleting."
                        }).end();
                    }
                    return res.status(200).end();
                });

        });
    })

module.exports = productRouter;