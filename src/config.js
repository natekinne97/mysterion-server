if(process.env.NODE_ENV === 'test'){
  process.env.DBURL = "mongodb://localhost:27017/mysterion-test";
}else{
  process.send.DBURL = "mongodb://localhost:27017/mysterion";
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8000,
  DBURL: process.env.DBURL || "mongodb://localhost:27017/mysterion",
};
