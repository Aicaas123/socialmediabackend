// init code
require("dotenv").config();
const router = require("express").Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const newUserRegistration = require("../models/userSchema");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const RequireLogin = require("../middleware/RequireLogin");

// middle ware

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//testing route
router.get("/testing", RequireLogin, (req, res) => {
  return res.status(422).json({ message: "Somthing is wrong" });
});

// user registration section
router.post("/newuser", async (req, res) => {
  // res.status(200).send("Psot Api Is Working ");
  console.log(req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(404).json({ message: "Plz Fill The All Required Field " });
  }
  try {
    const preuser = await newUserRegistration.findOne({ email: email });
    if (preuser) {
      return res.status(404).json({ message: "User Already Present With Us " });
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
    res.status(404).json({ error: error });
  }
});

// get all user details

router.get("/userlist", async (req, res) => {
  const alldata = await newUserRegistration.find();
  if (alldata) {
    res.status(200).json({ alldata });
  } else {
    res.send("No User Found...");
  }
});

// get user details on the basis of user id

router.get("/userlist/:userid", async (req, res) => {
  try {
    const userdetails = await newUserRegistration.findById(req.params.userid);
    // res.send(userdetails);
    if (userdetails) {
      res.send(userdetails);
    } else {
      res.json({ message: "Opps User Not Found..." });
    }
  } catch (error) {
    res.send("Somthing is Wrong....");
  }
});

// get update details of user with somthing details
router.put("/update/:userid", async (req, res) => {
  const { name, email, password } = req.body;
});

// delete user section
router.delete("/delete/:userid", async (req, res) => {
  try {
    const deleteuser = await newUserRegistration.findByIdAndDelete(
      req.params.userid
    );
    res.json({ message: "User Deleted Successfully.." });
  } catch (error) {
    res.send(error);
  }
});

// Login Api Section

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .json({ message: "Email or password field should not be blank" });
  }
  const savedUser = await newUserRegistration.findOne({ email: email });
  if (!savedUser) {
    return res.status(422).json({ message: "Invalid Creadential" });
  }
  try {
    bcrypt.compare(password, savedUser.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT);
        const { _id, name, email } = savedUser;
        res.status(200).json({
          message: "Login Success",
          token,
          user: { _id, name, email },
        });
      } else {
        console.log("password Not Match...");
        return res.status(422).json({ message: "Invalid Creadential" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// End of Login Section

// mail verification mail function
async function main(useremail, verification) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: "aicaastechnology@gmail.com", // generated ethereal user
      pass: "ptjvhryitvyhtstm", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "PaperWiff <aicaastechnology@gmail.com>", // sender address
    to: "sjha707@gmail.com", // list of receivers
    subject: `User Verification Code is ${verification}`, // Subject line
    text: `User Verification code is ${verification} `, // plain text body
    html: `User Verification code is ${verification} `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// Mail or User Verification Section

router.post("/verification", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(422).json({ message: "Kindly Fill The Text Box" });
  }
  const savedUser = await newUserRegistration.findOne({ email: email });
  if (!savedUser) {
    res.status(422).json({ message: "Sorry mailid not found..." });
  } else {
    // res.status(200).json({ message: "verification status" });
    const verification = Math.floor(100000 + Math.random() * 900000);
    await main(email, verification);
    res
      .status(200)
      .send({ message: "verification Code is Sent", verification, email });
  }
});

// Reset Password Section Here

router.post("/resetpassword", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ message: "Please Add All The Field" });
  } else {
    newUserRegistration.findOne({ email: email }).then(async (savedUser) => {
      if (savedUser) {
        savedUser.password = password;
        savedUser
          .save()
          .then((user) => {
            res.status(200).json({ message: "Password changed successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return res.status(422).json({ message: "Invalid User" });
      }
    });
  }
});

// Login Authorization route here

router.post("/userdata", (req, res) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization) {
    return res
      .status(422)
      .json({ error: "You Must be Logged In , Token Not Given" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT, (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "You must be logged in, Token Invalid" });
    }
    const { _id } = payload;
    newUserRegistration.findById(_id).then((userdata) => {
      res.status(200).json({
        message: "User Found",
        user: userdata,
      });
    });
  });
});

// testing middle were

router.post("/posting", RequireLogin, (req, res) => {
  const user = res.user;
  res.json({ userdetails: user._id });
});

// Profile Picture Update
router.post("/profilepic", RequireLogin, async (req, res) => {
  const { email, profilephoto } = req.body;
  // console.log(email);
  newUserRegistration.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
    savedUser.profilepicture = profilephoto;
    savedUser
      .save()
      .then((result) => {
        return res.status(200).json({ message: "Profile Update Successfilly" });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

//coverPhoto Updating

router.post("/coverphoto", (req, res) => {
  const { email, coverimage } = req.body;
  if (!email) {
    return res.status(422).json({ error: "Login Again" });
  }
  newUserRegistration
    .findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      }
      savedUser.coverpicture = coverimage;
      savedUser
        .save()
        .then((resulr) => {
          return res.status(200).json({ message: "Cover image Changed" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

//add bio description

router.post("/bio", (req, res) => {
  const { email, description } = req.body;
  if (!email) {
    return res.status(422).json({ error: "Login Again" });
  }
  newUserRegistration
    .findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalide Credentials" });
      }
      savedUser.details.bio = description;
      savedUser
        .save()
        .then((result) => {
          return res.status(200).json({ message: "Bio Successfully updated" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

//panname creation system

router.post("/setpanname", (req, res) => {
  const { email, panname } = req.body;
  if (!email) {
    return res.status(422).json({ error: "Login Again" });
  }
  newUserRegistration
    .findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      }
      savedUser.details.panname = panname;
      savedUser
        .save()
        .then((result) => {
          return res
            .status(200)
            .json({ message: "Pan name Change Succesfully" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

// followers

router.put("/follower", RequireLogin, (req, res) => {
  newUserRegistration.findByIdAndUpdate(
    req.body.followid,
    {
      $push: { followers: res.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res
          .status(422)
          .json({ error: "Somthing is Wrong with Followers" });
      }
      newUserRegistration
        .findByIdAndUpdate(
          res.user._id,
          {
            $push: { following: req.body.followid },
          },
          { new: true }
        )
        .then((result) => {
          return res.status(200).json({ message: "process done" });
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

//unfollow

router.put("/unfollower", RequireLogin, (req, res) => {
  newUserRegistration.findByIdAndUpdate(
    req.body.followid,
    {
      $pull: { followers: res.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res
          .status(422)
          .json({ error: "Somthing is Wrong with Followers" });
      }
      newUserRegistration
        .findByIdAndUpdate(
          res.user._id,
          {
            $pull: { following: req.body.followid },
          },
          { new: true }
        )
        .then((result) => {
          return res.status(200).json({ message: "process done" });
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

// ProfilePicture Uploading section
router.put("/setprofilepic", RequireLogin, (req, res) => {
  newUserRegistration
    .findByIdAndUpdate(
      res.user._id,
      {
        $set: { profilepicture: req.body.pic },
      },
      {
        new: true,
      }
    )
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.status(200).json(result);
      }
    });
});

// To search Followers and Followings Section

router.get("/search/:key", RequireLogin, async (req, res) => {
  await newUserRegistration
    .find({
      $or: [
        {
          name: { $regex: req.params.key },
        },
        {
          email: { $regex: req.params.key },
        },
      ],
    })
    .then((result) => {
      return res.status(200).json({ userdetails: result });
    })
    .catch((err) => console.log(err));
});
// module export
module.exports = router;
