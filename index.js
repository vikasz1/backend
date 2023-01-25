const express = require("express");
const app = express();
const cors = require("cors"); //Added this to resolve error of cors-connection
app.use(cors());

const data = require("./data");

app.get("/api/data", (req, res) => {
  res.json(data);
  
});

app.listen(5000, () => {
  console.log("API listening on port 5000!");
});
