const router = require("express").Router();
const { async } = require("regenerator-runtime");
// const { async } = require("regenerator-runtime");
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// UPDATE USER METHOD
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    // Encrypt updated password
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    //update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE METHOD
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER METHOD
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    //destructuring user : hides password
    const { password, ...others } = user._doc;

    //if everything is successful return user
    res.status(200).json({ others });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL USER METHOD
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    //limits to 5 result
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER STATS
//Gets users statistics per month
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  //returns DATE
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    //Gets user data from mongoDB : using mongoDB aggregate
    const data = await User.aggregate([
      //condition
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          //create month variable: takes the moth number inside createAt in MongoDb and
          //Assign it to month:
          month: { $month: "$createdAt" },
        },
      },

      //Groups users
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    //send response & data
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
