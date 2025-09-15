const { MongoClient } = require("mongodb");

async function main() {
  const uri = "mongodb://127.0.0.1:27017/customers";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("shopDB");

    const customers = [
      { "_id": "C1001", "name": "Alice", "city": "New York" },
      { "_id": "C1002", "name": "Bob", "city": "Los Angeles" },
      { "_id": "C1003", "name": "Charlie", "city": "Chicago" },
      { "_id": "C1004", "name": "David", "city": "Houston" },
      { "_id": "C1005", "name": "Eve", "city": "Seattle" }
    ];

    const orders = [
      { "_id": 1, "customerId": "C1001", "amount": 500, "product": "Laptop" },
      { "_id": 2, "customerId": "C1002", "amount": 1200, "product": "Phone" },
      { "_id": 3, "customerId": "C1001", "amount": 300, "product": "Headphones" },
      { "_id": 4, "customerId": "C1003", "amount": 700, "product": "Monitor" },
      { "_id": 5, "customerId": "C1004", "amount": 400, "product": "Keyboard" },
      { "_id": 6, "customerId": "C1002", "amount": 800, "product": "Tablet" },
      { "_id": 7, "customerId": "C1005", "amount": 900, "product": "Smartwatch" }
    ];

    await db.collection("customers").insertMany(customers);
    await db.collection("orders").insertMany(orders);

    console.log("Data inserted successfully.");
  } finally {
    await client.close();
  }
}

main().catch(console.error);
