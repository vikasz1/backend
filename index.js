const express = require("express");
const data = require("./data");
const app = express();
const Joi = require("@hapi/joi");
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
  email: { type: String, trim: true, required: true },
  parentName: { type: String, trim: true, required: true },
  studentName: { type: String, trim: true, required: true },
  phone: { type: String, required: true },
  message: String,
  date: { type: Date, default: Date.now, required: true },
  qualification: { type: String, trim: true, required: true },
  hasLaptop: { type: String, trim: true, required: true },
});
const Course = mongoose.model("Course", courseSchema);

async function getCourses() {
  const courses = await Course.find();
  return courses
}

function courseValidate(course) {
  const schema = {
    studentName: Joi.string().min(3).max(50).required(),
    parentName: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(50).email().required(),
    phone: Joi.string().length(10).regex(/^\d+$/).required(),
    message: Joi.string().min(3).max(150).required(),
    qualification: Joi.string().min(1).max(50).required(),
    hasLaptop: Joi.string().min(2).max(50).required(),
  };
  return Joi.validate(course, schema);
}


app.get("/api/data", async (req, res) => {
  const result = await getCourses();
  // console.log("My course:", allCourses);`
  res.json(result);
});

app.get("/", async (req, res) => {
  const value = await getCourses();
  console.log(value.length)
  res.send(
    `Total ${value.length} Students available in the database(mongo)`
  );
});

app.post("/api/data", async (req, res) => {
  const { error } = courseValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = new Course({
    email: req.body.email,
    parentName: req.body.parentName,
    studentName: req.body.studentName,
    phone: req.body.phone,
    message: req.body.message,
    qualification: req.body.qualification,
    hasLaptop: req.body.hasLaptop,
  });
  await course.save();
  console.log("Course created:", course);
  res.send(course);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}!`);
});
