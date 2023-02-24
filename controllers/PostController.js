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
  const {
    title,
    hashtag,

    postimage,
    category,
    fontcolor,
    copyright,
  } = req.body;
  if (!title || !postimage) {
    return res
      .status(401)
      .json({ error: "Kindly Choose a quotes with background" });
  }
  res.user.password = undefined;
  const post = new Post({
    title,
    hashtag,
    category,
    postimage,
    fontcolor,
    copyright,
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

router.get("/getallpost", RequireLogin, (req, res) => {
  Post.find()
    .populate("postedby", " _id, name profilepicture")
    .populate("comments.postedBy", "_id name")
    .then((allpost) => {
      res.status(200).json({ message: "All Post are", allpost });
    })
    .catch((err) => {
      console.log(err);
    });
});

// user post posted by own

router.get("/mypost", RequireLogin, (req, res) => {
  Post.find({ postedby: res.user._id })
    .populate("postedby", "_id name profilepicture")
    .then((mypost) => {
      return res.status(200).json({ mypost: mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

// post like

router.put("/like", RequireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { like: res.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedby", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

// count like

router.get("/likecount", RequireLogin, (req, res) => {
  const { id } = req.body;
  Post.find({ _id: id })
    .then((result) => {
      return res.status(200).json({ likes: result });
    })
    .catch((err) => console.log(err));
});
// Unlike post
router.put("/unlike", RequireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { like: res.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedby", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

// comment on post

router.put("/comments", RequireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: res.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comment: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedby", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        return res.status(200).json({ message: result });
      }
    });
});

//Display Comments of User

router.get("/allcomments/:postId", RequireLogin, (req, res) => {
  Post.findById(req.params.postId)
    .populate("postedby", "_id name")
    .then((allcomment) => {
      if (!allcomment) {
        return res.status(422).json({ error: "No Comments" });
      } else {
        return res
          .status(200)
          .json({ message: "Comment Find Yet", comment: allcomment });
      }
    })
    .catch((err) => console.log(err));
});

// to show myfollowing post
router.get("/myfollowingpost", RequireLogin, (req, res) => {
  Post.find({ postedby: { $in: res.user.following } })
    .populate("postedby", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((userpost) => {
      res.json(userpost);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
