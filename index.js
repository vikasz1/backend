const express = require("express");
const app = express();
const cors = require("cors"); //Added this to resolve error of cors-connection
app.use(cors());

const data = require("./data");

app.get("/api/data", (req, res) => {
  res.json(data);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}!`);
});
