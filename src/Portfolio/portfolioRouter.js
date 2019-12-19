const express = require("express");
const PortfolioService = require("./portfolioService");
const jsonBodyParser = express.json();
const xss = require("xss");
const portfolioRouter = express.Router();

// get all portfolio projects
portfolioRouter.route('/')
    .get(async(req, res, next)=>{
        try{
            // retrieve all the data
            let portfolio = await PortfolioService.findAll();

            return res.status(200).json(portfolio).end();

        }catch(err){
            console.log(err);
            return res.status(400).json({
                error: "Something went wrong."
            }).end();
        }
    });

// get portfolio by id
portfolioRouter.route('/:id')
    .get(async (req, res, next)=>{
        try{

            const id = req.params.id;
            const portfolio = await PortfolioService.findById(id);
            return res.status(200).json(portfolio);
        }catch(err){
            console.log(err);
            return res.status(400).json({
                error: "Something went wrong"
            })
        }
    });

// insert new portfolio
portfolioRouter.route('/')
    .post( jsonBodyParser,async (req, res, next)=>{
        const { image, company, review } = req.body;

        const newPort = {
            image: xss(image),
            company: xss(company),
            review: xss(review)
        }
            // validate the post
        for (const key of Object.keys(newPort)) {
            if (!newPort[key]) {
            
                return res.status(400).json({
                    error: `Missing field in ${key}`
                }).end()
            }
        }
       
        for (const key of Object.keys(newPort)) {
            if (/^ *$/.test(newPort[key])) {
                // It has only spaces, or is empty
                return res.status(400).json({
                    error: "Input is only spaces. Must include characters!"
                }).end();
            }
        }

        try{

            const port = await PortfolioService.create(newPort);

            return res.status(200).json(port).end();
        }catch(err){
            console.log(err);
            return res.status(400).json({
                error: "Something went wrong!"
            })
        }
    });    

portfolioRouter.route('/:id')
    .patch(async(req, res, next)=>{
        const id = req.params.id;

        const updatePort = {
          image: xss(image),
          company: xss(company),
          review: xss(review)
        };

                  // validate the post
        for (const key of Object.keys(updatePort)) {
            if (!updatePort[key]) {
            
                return res.status(400).json({
                    error: `Missing field in ${key}`
                }).end()
            }
        }
       
        for (const key of Object.keys(obj)) {
            if (/^ *$/.test(obj[key])) {
                // It has only spaces, or is empty
                return res.status(400).json({
                    error: "Input is only spaces. Must include characters!"
                }).end();
            }
        }
        try{
            const port = await PortfolioService.updateById(id, updatePort);

            if(!port){
                return res.status(400).json({
                    error: "Failed to insert"
                })
            }

            return res.status(200).json(port);

        }catch(err){
            console.log(err);
            return res.status(400).json({
                error: "Something went wrong"
            })
        }

    });

portfolioRouter.route('/:id')
    .delete(async (req, res, next)=>{
        const id = req.params.id;

        try{
            let port = await PortfolioService.deleteById(id);

            return res.status(200).json(port);

        }catch(err){
            console.log(err);
            return res.status(400).json({
                error: "Something went wrong"
            }).end();
        }
    })

module.exports = portfolioRouter;