const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//CREATE Product
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const saveCart = await newCart.save();
    res.status(200).json(saveCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE USER METHOD
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    //update product
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE METHOD
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER CART METHOD
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    //if everything is successful return user
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// // GET ALL  METHOD

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    //find all carts
    const carts = await Cart.find();
    //get all carts
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
