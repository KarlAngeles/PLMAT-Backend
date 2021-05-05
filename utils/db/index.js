const config = require('../config')
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${dbUser}:${config.DB_PW}@plmat.q0glb.mongodb.net/${config.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
