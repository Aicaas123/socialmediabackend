require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const database = require("./database/database");
const userController = require("./controllers/userController");
const newUserRegistration = require("./models/userSchema");
const cors = require("cors");
const app = express();

const port = process.env.PORT;

// use of middle ware section

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

//
app.use("/api", userController);
// app.use("/api", userController);

// defaulr Routes Section here

app.get("/", (req, res) => {
  // res.send("Index File Is Working Now ");
  res.json({
    success: true,
    message: "Wlecome To Backend Zone Trying section !",
  });
});

// User Creation Section

// app.post("/signup", (req, res) => {
//   console.log(req.body);
//   res.send("There is Post API Called ...");
// });

app.listen(port, () => {
  console.log(`server is runnning on poort ${port}`);
});
