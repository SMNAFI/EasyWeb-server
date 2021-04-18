const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l532k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const orderCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION1}`);
    const adminCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION2}`);
    const serviceCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION3}`);
    const reviewCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION4}`);

    app.post('/addOrder', (req, res) => {
        orderCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/getAllOrders', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/addAdmin', (req, res) => {
        adminCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addService', (req, res) => {
        serviceCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/getAllServices', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/getService', (req, res) => {
        serviceCollection.find({ _id: ObjectID(req.query.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/addReview', (req, res) => {
        reviewCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/getAllReviews', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.delete('/deleteService', (req, res) => {
        serviceCollection.deleteOne({ _id: ObjectID(req.query.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

    app.post('/isAdmin', (req, res) => {
        adminCollection.find({ adminEmail: req.body.email })
            .toArray((err, documents) => {
                res.send(documents.length > 0);
            })
    })

    app.post('/updateStatus', (req, res) => {
        orderCollection.updateOne(
            { _id: ObjectID(req.body.id) },
            { $set: { status: req.body.status } }
        )
            .then(result => {
                res.send(result.modifiedCount > 0);
            })
    })

    app.post('/getUserOrders', (req, res) => {
        orderCollection.find({ email: req.body.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

});

app.listen(port);