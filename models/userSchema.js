// init value section

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// user schema
const userSchema = mongoose.Schema({
  // inserted data into data base is
  // {name , email , password }

  name: {
    type: String,
    required: [true, "Name Field Should Not be Blank"],
    // min : 3,
  },
  username: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: [true, "Email Field Should Not be Blank"],
    trim: true,
    unique: [true, "This email is Already In Use "],
    lowercase: true,
  },
  password: {
    type: String,
    min: 6,
    required: [true, "Password Field Should Not be Blank"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  profilepicture: {
    type: String,
    default: "",
  },
  coverpicture: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  byear: {
    type: Number,
    default: "",
    trim: true,
  },
  bmonth: {
    type: Number,
    default: "",
    trim: true,
  },
  bday: {
    type: Number,
    default: "",
    trim: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  friends: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  followers: {
    type: Array,
    default: [],
  },
  request: {
    type: Array,
    default: [],
  },
  details: {
    bio: {
      type: String,
      default: "",
    },
    panname: {
      type: String,
      default: "",
    },
    jobtitle: {
      type: String,
      default: "",
    },
    workplace: {
      type: String,
      default: "",
    },
    highschool: {
      type: String,
      default: "",
    },
    college: {
      type: String,
      default: "",
    },
    currentcity: {
      type: String,
      default: "",
    },
    hometown: {
      type: String,
      default: "",
    },
    relationship: {
      type: String,
      default: "",
      // enum :['Single','In Relation','Married','Divorced'],
    },
    instagram: {
      type: String,
      default: "",
    },
    facebook: {
      type: String,
      default: "",
    },
    youtube: {
      type: String,
      default: "",
    },
  },
});

// password hashing point before saving
userSchema.pre("save", async function(next) {
  const user = this;
  // console.log("before Saving Data", user);
  if (!user.isModified("password")) {
    return next();
  }
  user.password = await bcrypt.hash(user.password, 8);
  next();
});

//create Model

mongoose.model("newusers", userSchema);

// module export section

module.exports = mongoose.model("newusers");
