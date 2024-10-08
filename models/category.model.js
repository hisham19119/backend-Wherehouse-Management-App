const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    // unique: true,
    // required: [true, "title is required"],
  },
});

module.exports = mongoose.model("Category", categorySchema);
