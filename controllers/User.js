require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const RequireLogin = require("../middleware/RequireLogin");
const Post = mongoose.model("userpost");
const newUserRegistration = require("../models/userSchema");

router.get("/user/:id", RequireLogin, async (req, res) => {
  await newUserRegistration
    .findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedby: req.params.id })
        .populate("postedby", "_id name profilepicture")
        .exec((err, post) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.status(200).json({ user, post });
        });
    })
    .catch((err) => {
      return res.status(400).json({ error: "User Not Found" });
    });
});

// to follow user
router.put("/follow", RequireLogin, (req, res) => {
  newUserRegistration.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      newUserRegistration
        .findByIdAndUpdate(
          req.user._id,
          {
            $push: { following: req.body.followId },
          },
          {
            new: true,
          }
        )
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          return res.status(400).json({ error: err });
        });
    }
  );
});

// to unfollow user
router.put("/unfollow", RequireLogin, (req, res) => {
  newUserRegistration.findByIdAndUpdate(
    req.body.followId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      newUserRegistration
        .findByIdAndUpdate(
          req.user._id,
          {
            $pull: { following: req.body.followId },
          },
          {
            new: true,
          }
        )
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          return res.status(400).json({ error: err });
        });
    }
  );
});

//follow
module.exports = router;
