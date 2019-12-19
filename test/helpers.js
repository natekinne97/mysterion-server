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


insertItems = (items, url) =>{
    MongoClient.connect(url, (err, db)=>{
        let dbo = db.db('mysterion-test');
        
        dbo.collection('products').insertMany(items, (err, result)=>{
            if(err)console.log(err);
            if(result){
                console.log('product inserted');
            }
            db.close();
        })
    });
}

removeCollections = (url)=>{
  MongoClient.connect(url, (err, db) => {
    let dbo = db.db("mysterion-test");

    dbo.collection("products").remove({});
  });
}


module.exports = {
    makeProductArray,
    insertItems,
    removeCollections,
}