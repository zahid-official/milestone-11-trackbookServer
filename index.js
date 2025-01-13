require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://trackbook-official.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// custom middleware
const verifyToken = (req, res, next) => {
  const clientToken = req.cookies?.token;
  if (!clientToken) {
    return res.status(401).send({ message: "Unauthorize Access" });
  }

  // verify both token
  jwt.verify(clientToken, process.env.ACCESS_TOKEN, (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "Unauthorize Access" });
    }

    // creating a new property in req object
    req.accessToken = decoded;
    next();
  });
};

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

    // jwt token generate
    app.post("/jwt", (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV==='production',
          sameSite: process.env.NODE_ENV==='production' ? 'none' : 'strict',
        })
        .send({ signIn: true });
    });

    // jwt token remove
    app.post("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV==='production',
          sameSite: process.env.NODE_ENV==='production' ? 'none' : 'strict',
        })
        .send({ signOut: true });
    });

    // for borrowedBooks
    app.get("/borrowedBooks/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { borrowerEmail: email };

      // verify email by query email
      if (req.accessToken.email !== email) {
        return res.status(403).send({ message: "Forbidden Access" });
      }

      const result = await borrowedCollection.find(query).toArray();
      res.send(result);
    });

    // read operation
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

    // create operation for addBook
    app.post("/addBook", async (req, res) => {
      const data = req.body;
      const result = await booksCollection.insertOne(data);
      res.send(result);
    });

    // for borrowBook
    app.post("/borrow", async (req, res) => {
      const isbn = req.body.isbn;
      const borrowerEmail = req.body.borrowerEmail;
      const filter = { isbn, borrowerEmail };
      const isExist = await borrowedCollection.findOne(filter);

      // validation is already borrowed
      if (isExist) {
        return res.send(null);
      }

      // insert data to borrowedCollection
      const data = req.body;
      await borrowedCollection.insertOne(data);

      // decrease quantity in booksCollection
      const query = { _id: new ObjectId(isbn) };
      const decrease = {
        $inc: { quantity: -1 },
      };
      await booksCollection.updateOne(query, decrease);
      const result = await booksCollection.findOne(query);
      res.send(result);
    });

    // update operation for UpdateBook
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
        options
      );
      res.send(result);
    });

    // delete operation for borrowedBooks
    app.delete("/returnBook", async (req, res) => {
      // delete
      const isbn = req.query.isbn;
      const query = { isbn };
      await borrowedCollection.deleteOne(query);

      // increase quantity in booksCollection
      const cursor = { _id: new ObjectId(isbn) };
      const increase = {
        $inc: { quantity: 1 },
      };
      await booksCollection.updateOne(cursor, increase);

      // update ui borrowedBooks
      const borrowerEmail = req.query.borrowerEmail;
      const filter = { borrowerEmail };
      const result = await borrowedCollection.find(filter).toArray();
      res.send(result);
    });

    // filter operation for allBooks
    app.get("/filter", async (req, res) => {
      const query = { quantity: { $gt: 0 } };
      const result = await booksCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.log);

app.listen(port, () => {
  console.log(`Server Running on...: ${port}`);
});
