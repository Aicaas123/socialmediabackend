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
  postedby: {
    type: ObjectId,
    ref: "newusers",
  },
  category: {
    type: String,
  },
});

mongoose.model("userpost", PostSchema);
module.exports = mongoose.model("userpost");
