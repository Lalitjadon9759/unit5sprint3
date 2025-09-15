const { MongoClient } = require('mongodb');
const fs = require('fs');

async function main() {
    const uri = "mongodb://127.0.0.1:27017/e-commerce";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("ecommerce");
        const collection = db.collection("orders");

        
        const orders = JSON.parse(fs.readFileSync('./data/orders.json'));

        
        await collection.deleteMany({});
        await collection.insertMany(orders);

        console.log("Data inserted successfully!");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
}

main();
