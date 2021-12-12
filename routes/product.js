const router = require("express").Router();
// const { async } = require("regenerator-runtime");
const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//CREATE Product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const saveProduct = await newProduct.save();
    res.status(200).json(saveProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE USER METHOD
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    //update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE METHOD
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET PRODUCT METHOD
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    //if everything is successful return user
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL PRODUCT METHOD
router.get("/", async (req, res) => {
  // fetch new product query
  const qNew = req.query.new;
  // fetch product by category query
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      //if no query, get all products from DB
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
