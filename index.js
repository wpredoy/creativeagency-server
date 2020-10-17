// database user name creative
// database password angecy123456
//database name : creative; agency

const express = require("express");
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors")
const fs = require('fs-extra');
require('dotenv').config()
const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tq72w.mongodb.net/name?retryWrites=true&w=majority";


const app = express();
const port = 5000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static('agency'));
app.use(fileUpload());



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const agencycollection = client.db("name").collection("namelist");
    const orderCollection = client.db("name").collection("orderCollection");
    const reviewCollection = client.db("name").collection("review");
    const adminEmailCT = client.db("name").collection("adminemail");

// admin post
app.post('/agencyinfo', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const newImg = req.files.file.data;
    const encImg = newImg.toString('base64');
    var img = {
        contentType: req.files.file.mimetype,
        size: req.files.file.size,
        img: Buffer.from(encImg, 'base64')
    }
    agencycollection.insertOne({ title, description, img})
        .then(result => {
            console.log(result)
            res.send(result.insertedCount > 0)
        })
});

    app.get('/allagency', (req,res)=> {
        agencycollection.find({})
        .toArray((err,documents)=> {
            res.send(documents)
        })
    })


    // UserOrder post
    app.post('/order', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const service = req.body.service;
        const description = req.body.description;
        const price = req.body.price;
        const newImg = file.data;
        const orderImage = JSON.parse(req.body.orderImage)
        const encImg = newImg.toString('base64');
        var image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        };
        orderCollection.insertOne({ name, email, service, description, price, image,orderImage })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/orderserverlist', (req, res) => {
        orderCollection.find({email: req.query.email})
            .toArray((err, document) => {
                res.send(document);
            })

    })
// admin all order review
    app.get('/adminAllOrderReview', (req,res)=> {
        orderCollection.find({})
        .toArray((err, document) => {
            res.send(document);
        })
    })

   // review collection
   app.post('/allReview', (req, res) => {
    const name = req.body.name;
    const designation = req.body.designation;
    const reviewdescription = req.body.reviewdescription;
    const newImg = req.files.file.data;
    const encImg = newImg.toString('base64');
    var image = {
        contentType: req.files.file.mimetype,
        size: req.files.file.size,
        img: Buffer.from(encImg, 'base64')
    }
    reviewCollection.insertOne({ name, designation,image,reviewdescription })
        .then(result => {
            console.log(result);
            res.send(result)
        })
})

    app.get('/getAllReview', (req, res) => {
        reviewCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
})


// make Admin
app.post("/check-admin", (req, res) => {
    const email = req.body.email;
    adminEmailCT.find({ email: email }).toArray((err, doc) => {
      if (doc.length === 0) {
        res.send({ admin: false });
      } else {
        res.send({ admin: true });
      }
    });
  });


  app.post("/addAdmin", (req, res) => {
    const admin = {
        email: req.body.email
    }
    adminEmailCT.insertOne(admin)
    .then((result) => {
      res.json({adminadd : result.insertedCount > 0})
    });
  });


})



app.listen(port)
