const { body } = require("express-validator");
const Product = require("../../models/product.model");
const validatorMiddleware = require("./validator.middleware");
const Category = require("../../models/category.model");

const createProductValidator = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("product title is required")
      .isLength({ min: 2 })
      .withMessage("product title is too short")
      .isLength({ max: 50 })
      .withMessage("product title is too long"),

    body("price")
      .notEmpty()
      .withMessage("product price is required")
      .isNumeric()
      .withMessage("product price should be a number"),

    body("priceAfterDiscount")
      .optional()
      .isNumeric()
      .withMessage("priceAfterDiscount should be a number")
      .custom((value, { req }) => {
        if (req.body.price <= value) {
          throw new Error("Price after discount must be less than price");
        }
        return true;
      }),

    body("quantity")
      .notEmpty()
      .withMessage("quantity is required")
      .isNumeric()
      .withMessage("quantity should be a number"),

    body("sold")
      .optional()
      .isNumeric()
      .withMessage("quantity should be a number"),

    body("colors")
      .optional()
      .isArray()
      .withMessage("colors should be an array of strings"),

    body("sizes")
      .optional()
      .isArray()
      .withMessage("sizes should be an array of strings"),

    body("category")
      .notEmpty()
      .withMessage("category is required")
      .isMongoId()
      .withMessage("invalid id format")
      .custom((categoryId) =>
        Category.findById(categoryId).then((category) => {
          if (!category) {
            return Promise.reject(
              new Error(`No category for this id: ${categoryId}`)
            );
          }
        })
      ),
    validatorMiddleware,
  ];
};

const updateProductValidator = () => {
  return [
    body("title")
      .optional()
      .notEmpty()
      .withMessage("product title is required")
      .isLength({ min: 2 })
      .withMessage("product title is too short")
      .isLength({ max: 50 })
      .withMessage("product title is too long"),

    body("price")
      .optional()
      .notEmpty()
      .withMessage("product price is required")
      .isNumeric()
      .withMessage("product price should be a number"),

    body("priceAfterDiscount")
      .optional()
      .isNumeric()
      .withMessage("priceAfterDiscount should be a number")
      .custom((value, { req }) => {
        if (req.body.price <= value) {
          throw new Error("Price after discount must be less than price");
        }
        return true;
      }),

    body("quantity")
      .optional()
      .notEmpty()
      .withMessage("quantity is required")
      .isNumeric()
      .withMessage("quantity should be a number"),

    body("sold")
      .optional()
      .isNumeric()
      .withMessage("quantity should be a number"),

    body("colors")
      .optional()
      .isArray()
      .withMessage("colors should be an array of strings"),

    body("sizes")
      .optional()
      .isArray()
      .withMessage("sizes should be an array of strings"),

    body("category")
      .optional()
      .notEmpty()
      .withMessage("category is required")
      .isMongoId()
      .withMessage("invalid id format")
      .custom((categoryId) =>
        Category.findById(categoryId).then((category) => {
          if (!category) {
            return Promise.reject(
              new Error(`No category for this id: ${categoryId}`)
            );
          }
        })
      ),
    validatorMiddleware,
  ];
};

module.exports = {
  createProductValidator,
  updateProductValidator,
};
