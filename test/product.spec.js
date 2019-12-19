const app = require('../src/app');
const helpers = require('./helpers');
const {DBURL} = require('../src/config');

// tests product endpoints
describe('product end-points', ()=>{
    let items = helpers.makeProductArray();
    before('make connection', ()=>{
      helpers.insertItems(items, DBURL, 'products');
    });

    after('removes all elements of collection', ()=>{
      helpers.removeCollections(DBURL, 'products');
    });

    it('GET returns all products', ()=>{
      return supertest(app)
            .get('/api/product/')
            .expect(200)
            .expect(res=>{
              expect(res.body[0]).to.have.property('_id');
              expect(res.body[0]).to.have.property("image");
              expect(res.body[0]).to.have.property("title");
              expect(res.body[0]).to.have.property("price");
            });
    });

    it('GET by id returns a single product', ()=>{
      // the strategy here is to get all the products
      // then use the UUID to find one.
        return supertest(app)
                .get('/api/product/')
                .expect(200)
                .expect(res=>{
                  return supertest(app)
                      .get(`/api/product/${res.body[0].id}`)
                      .expect(200)
                      .expect(res=>{
                        expect(res.body).to.have.property("_id");
                        expect(res.body).to.have.property("image");
                        expect(res.body).to.have.property("title");
                        expect(res.body).to.have.property("description");
                        expect(res.body).to.have.property("price");
                        expect(res.body).to.eql(1);
                      })
                })
    });

    // post to make a new entry
    it('POST Should return 200 and the new product', ()=>{
      const fakeProduct = {
        image: 'some image',
        title: 'a title',
        description: 'some descriptoin',
        price: 1000
      }
      return supertest(app)
              .post('/api/product/')
              .send(fakeProduct)
              .expect(200)
              .expect(res=>{
                // must haves
                expect(res.body).to.have.property("_id");
                expect(res.body).to.have.property("image");
                expect(res.body).to.have.property("title");
                expect(res.body).to.have.property("description");
                expect(res.body).to.have.property("price");
                // expected output
                expect(res.body.image).to.eql(fakeProduct.image);
                expect(res.body.title).to.eql(fakeProduct.title);
                expect(res.body.description).to.eql(fakeProduct.description);
                expect(res.body.price).to.eql(fakeProduct.price);

              })
    });


    it('PATCH returns updated product', ()=>{
      // the goal here it to retrieve a product and use
      // the id of the first response to make a patch
      // fake post to update

      const fakeProduct = {
        image: "product image",
        title: "fake title",
        description: "fake description",
        price: 200
      }
      return supertest(app)
              .get('/api/product/')
              .expect(200)
              .expect(res=>{
                const id = res.body[0].id;
                return supertest(app)
                        .patch(`/api/product/${id}`)
                        .send(fakeProduct)
                        .expect(200)
                        .expect(res=>{
                          expect(res.body).to.have.property('_id');
                          expect(res.body).to.have.property("image");
                          expect(res.body).to.have.property("title");
                          expect(res.body).to.have.property("description");
                          expect(res.body).to.have.property("price");
                          // expected output
                          expect(res.body.image).to.eql(fakeProduct.image);
                          expect(res.body.title).to.eql(fakeProduct.title);
                          expect(res.body.description).to.eql(fakeProduct.description);
                          expect(res.body.price).to.eql(fakeProduct.price);

                        });
              })
    });

    describe('Product endpoints unhappy points', ()=>{

        // start with post
      it('POST returns 400 when undefined object sent image', ()=>{
          const fakePost = {
            image: '',
            title: 'thing',
            description: 'thing',
            price: 0
          }
          return supertest(app)
              .post('/api/product/')
              .send(fakePost)
              .expect(400)
              .expect(res=>{
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.eql("Missing field in image");
              });
      });
      
      it("POST returns 400 when undefined object sent image", () => {
           const fakePost = {
             image: "thing",
             title: "",
             description: "thing",
             price: 0
           };
           return supertest(app)
             .post("/api/product/")
             .send(fakePost)
             .expect(400)
             .expect(res => {
               expect(res.body).to.have.property("error");
               expect(res.body.error).to.eql("Missing field in title");
             });
      
      });

      it("POST returns 400 when undefined object sent image", () => {
           const fakePost = {
             image: "thing",
             title: "thing",
             description: "",
             price: 1
           };
           return supertest(app)
             .post("/api/product/")
             .send(fakePost)
             .expect(400)
             .expect(res => {
               expect(res.body).to.have.property("error");
               expect(res.body.error).to.eql("Missing field in description");
             });
      });
      
      it('POST returns 400 when not integer is sent for price', ()=>{
             const fakePost = {
               image: "thing",
               title: "thing",
               description: "thing",
               price: 'hello'
             };
             return supertest(app)
               .post("/api/product/")
               .send(fakePost)
               .expect(400)
               .expect(res => {
                 expect(res.body).to.have.property("error");
                 expect(res.body.error).to.eql("Price must be a number");
               });
      
      });

      it('returns 400 when just spaces image', ()=>{
              const fakePost = {
                image: " ",
                title: "thing",
                description: "thing",
                price: 1
              };
              return supertest(app)
                .post("/api/product/")
                .send(fakePost)
                .expect(400)
                .expect(res => {
                  expect(res.body).to.have.property("error");
                  expect(res.body.error).to.eql(
                    "Input is only spaces. Must include characters!"
                  );
                });
      });
      it("returns 400 when just spaces title", () => {
           const fakePost = {
             image: "thing",
             title: " ",
             description: "thing",
             price: 1
           };
           return supertest(app)
             .post("/api/product/")
             .send(fakePost)
             .expect(400)
             .expect(res => {
               expect(res.body).to.have.property("error");
               expect(res.body.error).to.eql(
                 "Input is only spaces. Must include characters!"
               );
             });
      });

      it("returns 400 when just spaces description", () => {
           const fakePost = {
             image: "thing",
             title: "thing",
             description: " ",
             price: 1
           };
           return supertest(app)
             .post("/api/product/")
             .send(fakePost)
             .expect(400)
             .expect(res => {
               expect(res.body).to.have.property("error");
               expect(res.body.error).to.eql(
                 "Input is only spaces. Must include characters!"
               );
             });
      });
      // check with patch
      it("returns Failed to insert item when not found", ()=>{
          const fakePost = {
             image: "thing",
             title: "thing",
             description: "thing",
             price: 1
           };
           return supertest(app)
             .patch("/api/product/1292929292929")
             .send(fakePost)
             .expect(400)
             .expect(res => {
               expect(res.body).to.have.property("error");
               expect(res.body.error).to.eql("Something went wrong");
             });
      });

      it('returns 400 when undefined patch Image', ()=>{
        const fakeProduct = {
          image: '',
          title: 'thing',
          description: 'thing',
          price: 1
        }

        return supertest(app)
                .get('/api/product/')
                .expect(200)
                .expect(res=>{
                  const id = res.body[0].id;
                  return supertest(app)
                    .patch(`/api/product/${id}`)
                    .send(fakeProduct)
                    .expect(400)
                    .expect(res=>{
                      expect(res.body).to.have.property('error')
                      expect(res.body.erro).to.eql('Missing key in image');
                    })

                });

      });

      it("returns 400 when undefined patch title", () => {
          const fakeProduct = {
            image: "thing",
            title: "",
            description: "thing",
            price: 1
          };

          return supertest(app)
            .get("/api/product/")
            .expect(200)
            .expect(res => {
              const id = res.body[0].id;
              return supertest(app)
                .patch(`/api/product/${id}`)
                .send(fakeProduct)
                .expect(400)
                .expect(res => {
                  expect(res.body).to.have.property("error");
                  expect(res.body.erro).to.eql("Missing key in title");
                });
            });
      });

      it("returns 400 when just undefined patch description", () => {
        const fakeProduct = {
          image: "thing",
          title: "thing",
          description: "",
          price: 1
        };

        return supertest(app)
          .get("/api/product/")
          .expect(200)
          .expect(res => {
            const id = res.body[0].id;
            return supertest(app)
              .patch(`/api/product/${id}`)
              .send(fakeProduct)
              .expect(400)
              .expect(res => {
                expect(res.body).to.have.property("error");
                expect(res.body.erro).to.eql("Missing key in description");
              });
          });
      });

      it("returns 400 when just space patch image", () => {
        const fakeProduct = {
          image: " ",
          title: "thing",
          description: "thing",
          price: 1
        };

        return supertest(app)
          .get("/api/product/")
          .expect(200)
          .expect(res => {
            const id = res.body[0].id;
            return supertest(app)
              .patch(`/api/product/${id}`)
              .send(fakeProduct)
              .expect(400)
              .expect(res => {
                expect(res.body).to.have.property("error");
                expect(res.body.erro).to.eql(
                  "Input is only spaces. Must include characters!"
                );
              });
          });
      });

      it("returns 400 when just space patch title", () => {
        const fakeProduct = {
          image: "thing",
          title: " ",
          description: "thing",
          price: 1
        };

        return supertest(app)
          .get("/api/product/")
          .expect(200)
          .expect(res => {
            const id = res.body[0].id;
            return supertest(app)
              .patch(`/api/product/${id}`)
              .send(fakeProduct)
              .expect(400)
              .expect(res => {
                expect(res.body).to.have.property("error");
                expect(res.body.erro).to.eql(
                  "Input is only spaces. Must include characters!"
                );
              });
          });
      });

      it("returns 400 when just space patch title", () => {
        const fakeProduct = {
          image: "thing",
          title: " ",
          description: "thing",
          price: 1
        };

        return supertest(app)
          .get("/api/product/")
          .expect(200)
          .expect(res => {
            const id = res.body[0].id;
            return supertest(app)
              .patch(`/api/product/${id}`)
              .send(fakeProduct)
              .expect(400)
              .expect(res => {
                expect(res.body).to.have.property("error");
                expect(res.body.erro).to.eql(
                  "Input is only spaces. Must include characters!"
                );
              });
          });
      });

      it("returns 400 when just space patch description", () => {
        const fakeProduct = {
          image: "thing",
          title: "thing",
          description: " ",
          price: 1
        };

        return supertest(app)
          .get("/api/product/")
          .expect(200)
          .expect(res => {
            const id = res.body[0].id;
            return supertest(app)
              .patch(`/api/product/${id}`)
              .send(fakeProduct)
              .expect(400)
              .expect(res => {
                expect(res.body).to.have.property("error");
                expect(res.body.erro).to.eql(
                  "Input is only spaces. Must include characters!"
                );
              });
          });
      });

      it("returns 400 when price is not a number", () => {
        const fakeProduct = {
          image: "thing",
          title: "thing",
          description: "thing",
          price: 'hello'
        };

        return supertest(app)
          .get("/api/product/")
          .expect(200)
          .expect(res => {
            const id = res.body[0].id;
            return supertest(app)
              .patch(`/api/product/${id}`)
              .send(fakeProduct)
              .expect(400)
              .expect(res => {
                expect(res.body).to.have.property("error");
                expect(res.body.erro).to.eql("Price must be a number");
              });
          });
      });
      // attempt to find wrong id
      // remove all things from collection
      // attempt get

    }); 


});
