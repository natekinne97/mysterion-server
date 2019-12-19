const app = require("../src/app");
const helpers = require("./helpers");
const { DBURL } = require("../src/config");

describe('portfolio endpoints', ()=>{
    let port = helpers.makePortfolioArray();

    // seed the db
    before('seed db', ()=>{
        helpers.insertItems(port, DBURL, 'portfolios');
    });

    // delete the db
    after("removes all elements of collection", () => {
      helpers.removeCollections(DBURL, "portfolio");
    });

    // get
    it('GET all items returns all items', ()=>{
        return supertest(app)
            .get('/api/portfolio/')
            .expect(200)
            .expect(res=>{
                
                // the must haves
                expect(res.body[0]).to.have.property('_id')
                expect(res.body[0]).to.have.property("company");
                expect(res.body[0]).to.have.property("review");
                expect(res.body[0]).to.have.property("image");
                // the retrieves

            })
    });

    it('GET Element by id', ()=>{
        return supertest(app)
            .get('/api/portfolio/')
            .expect(200)
            .expect(res=>{
               
                // the must haves
                expect(res.body[0]).to.have.property('_id')
                expect(res.body[0]).to.have.property("company");
                expect(res.body[0]).to.have.property("review");
                expect(res.body[0]).to.have.property("image");
                const id = res.body[0].id;
                const check = res.body[0];
                // get the item by id
                return supertest(app)
                    .get(`/api/portfolio/${id}`)
                    .expect(200)
                    .expect(res=>{
                        // the must haves
                        expect(res.body).to.have.property('_id')
                        expect(res.body).to.have.property("company");
                        expect(res.body).to.have.property("review");
                        expect(res.body).to.have.property("image");

                        expect(res.body.image).to.eql(check.image);
                        expect(res.body.company).to.eql(check.company);
                        expect(res.body.review).to.eql(check.review);
                    })

            })
    });

    it('POST insert new portfolio project returns 200 and project', ()=>{
        const fakePort = {
            image: "an image",
            company: "company",
            review: "review"
        }

        return supertest(app)
                .post('/api/portfolio/')
                .send(fakePort)
                .expect(200)
                .expect(res=>{
                    // the must haves
                        expect(res.body).to.have.property('_id')
                        expect(res.body).to.have.property("company");
                        expect(res.body).to.have.property("review");
                        expect(res.body).to.have.property("image");

                        expect(res.body.image).to.eql(fakePort.image);
                        expect(res.body.company).to.eql(fakePort.company);
                        expect(res.body.review).to.eql(fakePort.review);
                });
    });

    context('Unhappy endpoints for portfolio', ()=>{
        let fakePort = {
          image: "an image",
          company: "company",
          review: "review"
        };

        for(const keys of Object.keys(fakePort)){
            let fake = {
              image: "an image",
              company: "company",
              review: "review"
            };
            // test for undefined
            it(`POST portfolio returns 400 undefined: ${keys}`, ()=>{
                fake[keys] = "";

                return supertest(app)
                    .post('/api/portfolio/')
                    .send(fake)
                    .expect(400)
                    .expect(res=>{
                        expect(res.body.error).to.eql(
                          `Missing field in ${keys}`
                        );
                    })
            });

            // test for spaces
            it('POST portfolio returns 400 Must have spaces', ()=>{
                   fake[keys] = " ";

                return supertest(app)
                    .post('/api/portfolio/')
                    .send(fake)
                    .expect(400)
                    .expect(res=>{
                        expect(res.body.error).to.eql(
                          `Input is only spaces. Must include characters!`
                        );
                    })
            });
        }
    });


});