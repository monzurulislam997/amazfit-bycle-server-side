const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());





const uri = "mongodb+srv://amazfit:gYmjEhvDR71IefnY@cluster0.1u9t2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect();
        const bicycleCollection = client.db("amazfit").collection("products");
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = bicycleCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            const products = await bicycleCollection.findOne(query)
            res.send(products)
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