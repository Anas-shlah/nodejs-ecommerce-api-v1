const mongoose = require("mongoose");

// 1- Create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minLength: [3, "Too shorts category name"],
      maxLength: [32, "Too long category name"],
    },
    slug: {
      type: "string",
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// 2- Create model
module.exports = mongoose.model("Brand", brandSchema);
