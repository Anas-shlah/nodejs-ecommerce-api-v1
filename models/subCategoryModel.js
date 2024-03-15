const mongoose = require("mongoose");

// 1- Create schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "subCategory required"],
      unique: [true, "subCategory must be unique"],
      minLength: [2, "Too shorts subCategory name"],
      maxLength: [32, "Too long subCategory name"],
    },
    slug: {
      type: "string",
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must be belong to a parent category"],
    },
  },
  { timestamps: true }
);

// 2- Create model
module.exports = mongoose.model("SubCategory", subCategorySchema);
