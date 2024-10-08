const Product = require("../models/product.model");
const factory = require("./factoryController");

const createProduct = async (req, res) => {
  await factory.createOne(Product, req, res);
};

const getAllProducts = async (req, res) => {
  await factory.getAll(Product, req, res);
};

const getSingleProduct = async (req, res) => {
  await factory.getOne(
    Product,
    {
      path: "category",
      select: "title -_id",
    },
    req,
    res
  );
};

const updateProduct = async (req, res) => {
  await factory.updateOne(Product, req, res);
};

const deleteProduct = async (req, res) => {
  await factory.deleteOne(Product, req, res);
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
