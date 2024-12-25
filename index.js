require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.rjxsn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // database collection
    const database = client.db("booksDB");
    const booksCollection = database.collection("books");
    const borrowedCollection = database.collection("borrowed");

    // read
    app.get("/", (req, res) => {
      res.send("Server Connected");
    });

    // for category
    app.get("/category/:category", async (req, res) => {
      const category = req.params.category;
      const query = { category };
      const result = await booksCollection.find(query).toArray();
      res.send(result);
    });

    // for bookDetails
    app.get("/bookDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await booksCollection.findOne(query);
      res.send(result);
    });

    // for allBooks
    app.get("/allBooks", async (req, res) => {
      const cursor = booksCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // for updateBook
    app.get("/updateBook/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await booksCollection.findOne(query);
      res.send(result);
    });

    // for borrowedBooks
    app.get("/borrowedBooks/:email", async (req, res) => {
      const email = req.params.email;
      const query = { borrowerEmail: email };
      const result = await borrowedCollection.find(query).toArray();
      res.send(result);
    });






    // create for addBook
    app.post("/addBook", async (req, res) => {
      const data = req.body;
      const result = await booksCollection.insertOne(data);
      res.send(result);
    });

    // for borrowBook
    app.post('/borrow', async(req, res) => {
      const isbn = req.body.isbn;
      const borrowerEmail = req.body.borrowerEmail;
      const filter = {isbn, borrowerEmail};
      const isExist = await borrowedCollection.findOne(filter);
      
      // validation is already borrowed
      if(isExist){
        return res.send(null)
      }

      // insert data to borrowedCollection
      const data = req.body;
      await borrowedCollection.insertOne(data);

      // decrease quantity in booksCollection
      const query = {_id: new ObjectId(isbn)};
      const decrease = {
        $inc: {quantity: -1}
      }
      await booksCollection.updateOne(query, decrease);
      const result = await booksCollection.findOne(query);
      res.send(result);
    })

    



    // update for UpdateBook
    app.put("/updateBook/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedData = {
        $set: {
          bookName: data.bookName,
          bookImage: data.bookImage,
          category: data.category,
          author: data.author,
          rating: data.rating,
          updaterEmail: data.updaterEmail,
        },
      };

      const result = await booksCollection.updateOne(
        query,
        updatedData,
        options,
      );
      res.send(result);
    });







    // delete for borrowedBooks
    app.delete('/returnBook', async(req, res) => {
      // delete
      const isbn = req.query.isbn;
      const query = {isbn}
      await borrowedCollection.deleteOne(query);

      // increase quantity in booksCollection
      const cursor = {_id: new ObjectId(isbn)};
      const increase = {
        $inc: {quantity: 1}
      }
      await booksCollection.updateOne(cursor, increase);

      // update ui borrowedBooks
      const borrowerEmail = req.query.borrowerEmail;
      const filter = {borrowerEmail}
      const result = await borrowedCollection.find(filter).toArray();
      res.send(result);
    })




  } finally {
  }
}
run().catch(console.log);

app.listen(port, () => {
  console.log(`Server Running on...: ${port}`);
});
