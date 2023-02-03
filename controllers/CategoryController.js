require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const categoryschema = require("../models/CategorySchema");
const Category = mongoose.model("categoryname");

router.post("/addcategory", (req, res) => {
  const { category } = req.body;
  if (!category) {
    return res.status(422).json({ error: "Kindly Fill The Filed" });
  }
  const catname = new Category({
    category,
  });
  catname
    .save()
    .then((result) => {
      return res.status(200).json({ message: "Category Created", result });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
