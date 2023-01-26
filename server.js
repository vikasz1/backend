const express = require("express");
const mongodb = require("mongodb");
//ChatGPT response
const router = express.Router();
const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "mydb";

router.get("/", (req, res) => {
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    db.collection("items")
      .find({})
      .toArray((err, items) => {
        if (err) throw err;
        res.send(items);
        client.close();
      });
  });
});

router.get("/:id", (req, res) => {
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    const id = new mongodb.ObjectID(req.params.id);
    db.collection("items").findOne({ _id: id }, (err, item) => {
      if (err) throw err;
      res.send(item);
      client.close();
    });
  });
});

router.post("/", (req, res) => {
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    db.collection("items").insertOne(req.body, (err, result) => {
      if (err) throw err;
      res.send(result.ops[0]);
      client.close();
    });
  });
});

router.put("/:id", (req, res) => {
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    const id = new mongodb.ObjectID(req.params.id);
    db.collection("items").updateOne(
      { _id: id },
      { $set: req.body },
      (err, result) => {
        if (err) throw err;
        res.send({ message: "Success" });
        client.close();
      }
    );
  });
});

router.delete("/:id", (req, res) => {
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    const id = new mongodb.ObjectID(req.params.id);
    db.collection("items").deleteOne({ _id: id }, (err, result) => {
      if (err) throw err;
      res.send({ message: "Success" });
      client.close();
    });
  });
});
