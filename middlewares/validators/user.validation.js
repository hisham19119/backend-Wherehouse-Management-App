const { body } = require("express-validator");
const User = require("../../models/user.model");
const validatorMiddleware = require("./validator.middleware");

const createUserValidator = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .isLength({ min: "2" })
      .withMessage("too short name")
      .isLength({ max: "40" })
      .withMessage("too long name"),

    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("invalid email address")
      .custom((val) =>
        User.findOne({ email: val }).then((user) => {
          if (user) {
            return Promise.reject(new Error("E-mail already in use"));
          }
        })
      ),

    body("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 characters")
      .custom((password, { req }) => {
        if (password !== req.body.passwordConfirm) {
          console.log(req.passwordConfirm);
          return Promise.reject(new Error("Passwords do not match"));
        }
        return true;
      }),

    body("mobile")
      .isMobilePhone(["ar-EG", "ar-SA", "ar-AE"])
      .withMessage(
        "only egypt, saudi arabia and United Arab Emirates mobile numbers are allowed"
      ),

    validatorMiddleware,
  ];
};
const updateUserValidator = () => {
  return [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("name is required")
      .isLength({ min: "2" })
      .withMessage("too short name")
      .isLength({ max: "40" })
      .withMessage("too long name"),

    body("email")
      .optional()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("invalid email address")
      .custom((val) =>
        User.findOne({ email: val }).then((user) => {
          if (user) {
            return Promise.reject(new Error("E-mail already in use"));
          }
        })
      ),
    body("password")
      .optional()
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 characters"),

    body("mobile")
      .optional()
      .isMobilePhone(["ar-EG", "ar-SA", "ar-AE"])
      .withMessage(
        "only egypt, saudi arabia and United Arab Emirates mobile numbers are allowed"
      ),

    validatorMiddleware,
  ];
};

module.exports = { createUserValidator, updateUserValidator };
