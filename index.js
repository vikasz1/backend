const express = require("express");
const data = require("./data");
const app = express();
const cors = require("cors"); //Added this to resolve error of cors-connection
app.use(cors());

require("dotenv").config();
const mongo_uri = process.env.mongo_uri;

//middleware
app.use(express.static("public"));
app.use(express.json());

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  // .connect("mongodb://localhost/playground")
  .connect(mongo_uri)
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.error("Couldn't connect to db", err));

const courseSchema = new mongoose.Schema({
  email: String,
  parentName: { type: String },
  studentName: { type: String },
  phone: String,
  message: String,
  date: { type: Date, default: Date.now },
  qualification: String,
  hasLaptop: String,
});
const Course = mongoose.model("Course", courseSchema);
let allCourses = null;

async function getCourses() {
  const courses = await Course.find();
  // console.log(courses);
  allCourses = courses;
}
async function createCourse(course) {
  try {
    const result = await course.save(); // or do validate()
    // await course.validate();
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

app.get("/api/data", async (req, res) => {
  await getCourses();
  // console.log("My course:", allCourses);`
  res.json(allCourses);
});

app.get("/", (req, res) => {
  getCourses();
  res.send(
    `total ${allCourses.length} courses available in the database(mongo)`
  );
});

app.post("/api/data", async (req, res) => {
  const course = new Course({
    email: req.body.email,
    parentName: req.body.parentName,
    studentName: req.body.studentName,
    phone: req.body.phone,
    message: req.body.message,
    qualification: req.body.qualification,
    hasLaptop: req.body.hasLaptop,
  });
  createCourse(course);
  res.send(req.body);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}!`);
});
