const MongoClient = require("mongodb").MongoClient;

makeProductArray = ()=>{
    return [
      {
        title: "lawn care",
        image: "image lawn",
        description: "some mowy dude",
        price: 1
      },
      {
        title: "dog care",
        image: "image dog",
        description: "some dog dude",
        price: 1
      },
      {
        title: "phone care",
        image: "image phone",
        description: "some phone dude",
        price: 1
      },
      {
        title: "bottle care",
        image: "bottle lawn",
        description: "some bottle dude",
        price: 1
      }

    ];
}

makePortfolioArray = ()=>{
  return [
    {
      image: "some image",
      company: "a company",
      review: "I liked it"
    },
    {
      image: "some image 2",
      company: "a company 2",
      review: "I liked it 2"
    },
    {
      image: "some image 2",
      company: "a company 2",
      review: "I liked it 2"
    },
  ];
}


insertItems = (items, url, collection) =>{
    MongoClient.connect(url,  { useUnifiedTopology: true, useNewUrlParser: true },(err, db)=>{
        let dbo = db.db('mysterion-test');
        
        dbo.collection(collection).insertMany(items, (err, result)=>{
            if(err)console.log(err);
            if(result){
                console.log('product inserted');
            }
            db.close();
        })
    });
}

removeCollections = (url, collection)=>{
  MongoClient.connect(
    url,
    { useUnifiedTopology: true, useNewUrlParser: true },
    (err, db) => {
      let dbo = db.db("mysterion-test");

      dbo.collection(collection).remove({});
    }
  );
}


module.exports = {
    makeProductArray,
    insertItems,
    removeCollections,
    makePortfolioArray,
}