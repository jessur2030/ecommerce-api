const router = require("express").Router();
// const { async } = require("regenerator-runtime");
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
// const { async } = require("regenerator-runtime");
// const dotenv = require("dotenv");
// dotenv.config();

//Register
router.post("/register", async (req, res) => {
  //register new user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    // Encrypt password
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    //save modal user object to db
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login function
router.post("/login", async (req, res) => {
  try {
    //finds user in db &
    // Decrypt password
    const user = await User.findOne({ username: req.body.username });
    //checks if there is a matching username
    !user && res.status(401).json("Wrong credential, please try again!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    //convert hashedPassword to string (Utf8)
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    //checks if provided password is === to stored pass in db
    OriginalPassword !== req.body.password &&
      res.status(401).json("Wrong credential, please try again!");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    //destructuring user : hides password
    const { password, ...others } = user._doc;

    //if everything is successful return user
    res.status(200).json({ others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
