const mongoose = require("mongoose");
const { trim } = require("validator");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      unique: true,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: [true, "quantity is required"],
    },
    price: {
      type: Number,
      required: ["true", "Price is required"],
      min: [0, "Price must be a positive number"],
      trim: true,
    },
    priceAfterDiscount: {
      type: Number,
      min: [0, "Price must be a positive number"],
      trim: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    colors: {
      type: [String],
    },
    sizes: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
