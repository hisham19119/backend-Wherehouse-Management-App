const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Branche", branchSchema);
