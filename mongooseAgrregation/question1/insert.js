const { MongoClient } = require("mongodb");
const fs = require("fs");

async function main() {
    const uri = "mongodb://127.0.0.1:27017/aggregation";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("salesDB");
        const collection = db.collection("sales");

        const data = JSON.parse(fs.readFileSync("./data/sales.json", "utf-8"));        await collection.deleteMany({});
        
        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} documents inserted`);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
