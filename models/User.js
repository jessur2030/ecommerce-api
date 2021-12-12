const mongoose = require("mongoose");

//creates user schema
const UserSchema = new mongoose.Schema(
  {
    //create user object
    //user properties
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
