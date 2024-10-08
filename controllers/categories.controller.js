const Category = require("../models/category.model");
const httpStatusText = require("../utils/httpStatusText");
const { validationResult } = require("express-validator");
// const mongoose = require("mongoose");

const createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Validation failed",
      Errors: errors.array(),
    });
  }
  const { title } = req.body;
  const oldCategory = await Category.findOne({ title: title });
  if (oldCategory) {
    return res
      .status(400)
      .json({ message: "Category with this title already exists" });
  }
  const newCategory = new Category({
    title,
  });
  await newCategory.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { newCategory } });
};

// const createCategory = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       status: httpStatusText.ERROR,
//       message: "Validation failed",
//       Errors: errors.array(),
//     });
//   }

//   const { title, description } = req.body;

//   // Additional validation to ensure title is not null or empty
//   if (!title || title.trim().length === 0) {
//     return res.status(400).json({
//       status: httpStatusText.ERROR,
//       message: "Title cannot be empty",
//     });
//   }

//   const oldCategory = await Category.findOne({ title: title });
//   if (oldCategory) {
//     return res
//       .status(400)
//       .json({ message: "Category with this title already exists" });
//   }

//   const newCategory = new Category({
//     title,
//     description,
//   });

//   try {
//     await newCategory.save();
//     res
//       .status(201)
//       .json({ status: httpStatusText.SUCCESS, data: { newCategory } });
//   } catch (err) {
//     if (err.code === 11000) {
//       return res.status(400).json({
//         status: httpStatusText.ERROR,
//         message: "Category with this title already exists",
//       });
//     }
//     console.error(err);
//     res.status(500).json({
//       status: httpStatusText.ERROR,
//       message: "Internal server error",
//     });
//   }
// };

const getAllCategories = async (req, res) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 2;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;
  const total = await Category.countDocuments();
  const categories = await Category.find().limit(limit).skip(skip);
  res.json({
    status: httpStatusText.SUCCESS,
    data: {
      categories,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
    },
  });
};

const getSingleCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.json({ status: httpStatusText.SUCCESS, data: { category } });
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({ message: "category not found" });
  } else {
    let updatedCategory;
    try {
      updatedCategory = await Category.updateOne(
        { _id: categoryId },
        { $set: { ...req.body } }
      );
      return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { updatedCategory: updatedCategory },
      });
    } catch (err) {
      return res.status(400).json({ message: "Failed to update category" });
    }
  }
};

const deleteCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const category = await Category.findById(categoryId);
  if (category) {
    try {
      let deletedCategory;
      deletedCategory = await Category.deleteOne({ _id: categoryId });
      const categories = await Category.find();
      res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { categories },
      });
    } catch (err) {
      res.status(401).json({ message: "category not deleted" });
    }
  }
  res.status(404).json({ message: "category not found" });
};

module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
