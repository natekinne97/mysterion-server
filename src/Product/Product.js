const express = require('express');
const ProductService = require('./productservice');
const jsonBodyParser = express.json();
const xss = require('xss');
const productRouter = express.Router();


// returns all elements
productRouter.route('/')
    .get( async (req, res, next)=>{
        try{
           
            const items = await ProductService.findAll();
            if(!items){
                console.log('no items');
                return res.status(400).json({
                    error: "No Items Found"
                })
            }
            return res.status(200).json(items);
        }catch(err){
            console.log(err);
        }
    });

productRouter.route('/:id')
    .get(async (req, res, next)=>{
        const id = req.params.id;

        const found = await ProductService.findById(id);
        if(!found){
            return res.status(400).json({
                error: "Does not exist"
            }).end();
        }
        return res.status(200).json(found);
    });

// insert new item
productRouter.route('/')
    .post( jsonBodyParser , async (req, res, next)=>{
        const { image, title, description, price} = req.body;

        
        // check if price is integer
        if(typeof price !== 'number'){
            return res.status(400).json({
                error: "Price must be a number"
            })
        }

        const newItem = {
          image: xss(image),
          title: xss(title),
          description: xss(description),
          price: price
        };
            // validate the post
        for (const key of Object.keys(newItem)) {
            if (!newItem[key]) {
            
                return res.status(400).json({
                    error: `Missing field in ${key}`
                }).end()
            }
        }
       
        for (const key of Object.keys(newItem)) {
            if (/^ *$/.test(newItem[key])) {
                // It has only spaces, or is empty
                return res.status(400).json({
                    error: "Input is only spaces. Must include characters!"
                }).end();
            }
        }

        try {
          let item = await ProductService.create(newItem);
          return res.status(200).json(item);
        } catch (err) {
          console.log(err);
          return res
            .status(400)
            .json({
              error: "Something went wrong"
            })
            .end();
        }
    });

productRouter.route('/:id')
    .patch(jsonBodyParser,async (req, res, next)=>{
        const {image, title, description, price} = req.body;
        const id = req.params.id;

        if(typeof price !== 'number'){
            return res.status(400).json({
                error: "Price must be a number"
            })
        }

        const updateItem = {
          image: xss(image),
          title: xss(title),
          description: xss(description),
          price: price
        }
                    // validate the post
        for (const key of Object.keys(updateItem)) {
            if (!updateItem[key]) {
            
                return res.status(400).json({
                    error: `Missing field in ${key}`
                }).end()
            }
        }
       
        for (const key of Object.keys(updateItem)) {
            if (/^ *$/.test(updateItem[key])) {
                // It has only spaces, or is empty
                return res.status(400).json({
                    error: "Input is only spaces. Must include characters!"
                }).end();
            }
        }
        try{

            const item = await ProductService.updateById(id, updateItem);
            
           
            if(!item){
                return res.status(400).json({
                    error: "Failed to insert item"
                }).end()
            }
            
            return res.status(200).json(item);

        }catch(err){
            console.log(err);
            return res
              .status(400)
              .json({
                error: "Something went wrong"
              })
              .end();
        }

    });

// delete by id
productRouter.route('/:id')
    .delete(async (req, res, next)=>{
        const id = req.params.id;

        try{
            let item = await ProductService.deleteById(id);

            return res.status(200).json(item);

        }catch(err){
            console.log(err);
            return res.status(400).json({
                error: "Something went wrong"
            }).end();
        }
    })

module.exports = productRouter;
