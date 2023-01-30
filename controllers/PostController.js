require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserPost = require("../models/PostSchema");
const RequireLogin = require("../middleware/RequireLogin");
const Post = mongoose.model("userpost");
// const userpost = require("../models/PostSchema");

// router.get("/userpost", (req, res) => {
//   res.send("Post Rought Working ");
// });
// Create Post By User
router.post("/createpost", RequireLogin, (req, res) => {
  const { title, hashtag, description, postimage, category } = req.body;
  if (!title || !postimage) {
    return res
      .status(401)
      .json({ error: "Kindly Choose a quotes with background" });
  }
  res.user.password = undefined;
  const post = new Post({
    title,
    hashtag,
    description,
    postimage,
    category,
    postedby: res.user,
  });
  post
    .save()
    .then((result) => {
      return res.status(200).json({ message: "post Created", result });
    })
    .catch((err) => {
      console.log(err);
    });
});

// display all post

router.get("/getallpost", (req, res) => {
  Post.find()
    .populate("postedby", " _id, name")
    .then((allpost) => {
      res.status(200).json({ message: "All Post are", allpost });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
