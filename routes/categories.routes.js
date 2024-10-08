const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categories.controller");

router
  .route("/")
  .post(categoryController.createCategory)
  .get(categoryController.getAllCategories);

router
  .route("/:categoryId")
  .patch(categoryController.updateCategory)
  .get(categoryController.getSingleCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
