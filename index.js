const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
require('dotenv').config()
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1u9t2.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://amazfit:W79a35SVQgX3mAxA@cluster0.1u9t2.mongodb.net/?retryWrites=true&w=majority";
// const uri = "mongodb+srv://amazfit:W79a35SVQgX3mAxA@cluster0.1u9t2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect();
        const bicycleCollection = client.db("amazfit").collection("products");
        const orderCollection = client.db("amazfit").collection("orders");
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = bicycleCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        });
        // -------------- get specific product info by id------------------

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            const products = await bicycleCollection.findOne(query)
            res.send(products)
        });

        // -------------- get specific order info by id------------------
        app.get('/order/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            const orders = await orderCollection.findOne(query)
            res.send(orders)
        });



        //update item
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedInfo = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updatedInfo.newQuantity,
                }
            }
            const result = await bicycleCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })


        //Add item to products
        app.post('/products', async (req, res) => {
            const newProducts = req.body;
            const result = await bicycleCollection.insertOne(newProducts);
            res.send(result)
        })


        app.post('/order', async (req, res) => {
            const activity = req.body;
            const result = await orderCollection.insertOne(activity);
            console.log(activity)
            res.json(result);
        });


        //get order data

        app.get('/order', async (req, res) => {
            const query = {};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        });



        //Delete one item from products
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await bicycleCollection.deleteOne(query);
            res.send(result)
        })
        //Delete order one item
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })

    }

    finally {

    }

}


app.get('/', (req, res) => {
    res.send("Hello amazfit")
})


run().catch(console.dir)

app.listen(port, () => {
    console.log('server is working')
})