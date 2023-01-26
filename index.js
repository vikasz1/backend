const express = require("express");
const data = require("./data");
const app = express();
const cors = require("cors"); //Added this to resolve error of cors-connection
app.use(cors());

require('dotenv').config()
const mongo_uri = process.env.mongo_uri


//middleware
app.use(express.static("public"));

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  // .connect("mongodb://localhost/playground")
  .connect(mongo_uri)
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.error("Couldn't connect to db", err));

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPulished: Boolean,
});
const Course = mongoose.model("Course", courseSchema);
let allCourses = null;
async function getCourses() {
  const courses = await Course.find();
  console.log(courses);
  allCourses = courses;
}
async function createCourse() {
  const course = new Course({
    name: "Java Course",
    author: "Vikas Maury",
    tags: ["simple", "OOPS"],
    isPulished: true,
    price: 15,
  });
  try {
    const result = await course.save(); // or do validate()
    // await course.validate();
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}
getCourses();
app.get("/api/data", (req, res) => {
  createCourse();
  getCourses();
  console.log("My course:", allCourses);
  res.json(allCourses);
});
app.get("/", (req, res) => {
  getCourses();
  res.send(`total ${allCourses.length} courses available in the database(mongo)`);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}!`);
});
