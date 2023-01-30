require("dotenv").config();
const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const newUserRegistration = mongoose.model("newusers");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "You must Have To Loggedin" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT, (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "Stop Working, Somthing is Wrong , Try Again" });
    }
    const { _id } = payload;
    newUserRegistration.findById(_id).then((userData) => {
      res.user = userData;
      next();
    });
  });
};
