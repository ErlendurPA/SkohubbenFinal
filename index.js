const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = "mongodb+srv://Erlend:adminPass@erlendcluster.danzgpe.mongodb.net/?authMechanism=DEFAULT";
console.log(uri, "conected");
const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db('skohubben');
    const users = database.collection('users');
    // Query for a user that has the type 'admin'
    const query = { type: 'admin' };
    const user = await users.findOne(query);
    console.log(user);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

const bodyParser = require('body-parser');

const express = require('express');


const session = require('express-session');
// const MongoStore = require('connect-mongo');

const app = express();
const path = require('path');

app.listen(22227, () => {
  console.log('Listening on port 22227');
}
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/shopHome.html'));
  console.log(req.session);
});

app.use(express.static(__dirname + '/views'));




