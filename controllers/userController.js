// init code
require("dotenv").config();
const router = require("express").Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const newUserRegistration = require("../models/userSchema");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

// middle ware

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// router Goes Here
// router.all('/newuser',(req,res)=>{
//     // res.status(200).send("Hi There is Api Working Point ");
//     console.log(req.body);
// });

// user registration section
router.post("/newuser", async (req, res) => {
  // res.status(200).send("Psot Api Is Working ");
  console.log(req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(404).send("Plz Fill The All Required Field ");
  }
  try {
    const preuser = await newUserRegistration.findOne({ email: email });
    if (preuser) {
      res.status(404).send("User Already Present With Us ");
    } else {
      const saveUser = new newUserRegistration({
        name,
        email,
        password,
      });
      await saveUser.save();
      const token = jwt.sign({ _id: saveUser._id }, process.env.JWT);
      res.send({ token });
      // res.status(201).json(saveUser);
      // console.log(saveUser);
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/userlist", async (req, res) => {
  const alldata = await newUserRegistration.find();
  if (alldata) {
    res.status(200).json({ alldata });
  } else {
    res.send("No User Found...");
  }
});

// module export
module.exports = router;
