const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  hashtag: {
    type: String,
  },
  description: {
    type: String,
  },
  postimage: {
    type: String,
    require: true,
  },

  category: {
    type: String,
  },
  fontcolor: {
    type: String,
  },
  copyright: {
    type: String,
  },
  postedby: {
    type: ObjectId,
    ref: "newusers",
  },

  like: {
    type: Array,
    default: [],
  },
  comment: {
    type: Array,
    default: [],
  },
});

mongoose.model("userpost", PostSchema);
module.exports = mongoose.model("userpost");
