const mongoose = require("mongoose");

//creates product schema
const ProductSchema = new mongoose.Schema(
  {
    //create product object
    //product properties
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
