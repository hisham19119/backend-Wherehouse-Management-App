const express = require("express");
const router = express.Router();
const factory = require("../controllers/factoryController");
const Product = require("../models/product.model");
const productController = require("../controllers/products.controller");

// const { deleteProduct } = require("../controllers/products.controller");
const {
  createProductValidator,
  updateProductValidator,
} = require("../middlewares/validators/product.validation");
router
  .route("/")
  .post(createProductValidator(), productController.createProduct)
  .get(productController.getAllProducts);

router
  .route("/:id")
  .patch(updateProductValidator(), productController.updateProduct)
  .get(productController.getSingleProduct)
  .delete(productController.deleteProduct);

module.exports = router;
