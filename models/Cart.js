const mongoose = require("mongoose");

//creates cart schema
const CartSchema = new mongoose.Schema(
  {
    //create cart object
    //cart properties
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
