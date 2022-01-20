const express = require('express');
const { MongoClient } = require('mongodb');
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.askxa.mongodb.net/ema-jhon?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(bodyParser.json()); 

const client = new MongoClient(uri, { useUnifiedTopology: true}, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1});
client.connect(err => {
  const productsCollection = client.db("ema-jhon").collection("products")
  const orderCollection = client.db("ema-jhon").collection("orders")

  app.post("/addProduct", (req, res)=>{
    const products = req.body;
          productsCollection.insertOne(products)
          .then(result=> {
              console.log(result.insertedCount);
              res.send(result.insertedCount)
          }) 
  });

  app.get("/products", (req, res)=>{
      productsCollection.find({})
      .toArray((err, documents)=>{
          res.send(documents)
      })
  });

  app.get("/product/:key", (req, res)=>{
      productsCollection.find({key: req.params.key})
      .toArray((err, documents)=>{
          res.send(documents)
      });    
  });

  app.post("/productsByKeys", (req, res)=>{
      const productKeys = req.body;
      productsCollection.find({key: {$in: productKeys}})
      .toArray((err, documents)=>{
          res.send(documents)
      })
  });

  app.post("/addOrder", (req, res)=>{
    const order = req.body;
    console.log(order)
          orderCollection.insertOne(order)
          .then(result=> {
              console.log(result.insertedCount);
              res.send(result)
          })
          
  });
});


app.get("/", (req, res)=>{
    res.send('welcome to ema-jon-simple server!')
})

app.listen(process.env.PORT || port)