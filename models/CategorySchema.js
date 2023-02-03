const mongoose = require("mongoose");

const CategorySchemma = new mongoose.Schema({
  category: {
    type: String,
    require: true,
  },
});

// mongoose.model("categoryname", CategorySchemma);
// module.exports = mongoose.model("categoryname");

mongoose.model("categoryname", CategorySchemma);
module.exports = mongoose.model("categoryname");
