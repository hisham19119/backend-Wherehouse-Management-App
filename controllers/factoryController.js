const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const ApiFeatures = require("../utils/apiFeatures");

const createOne = async (Model, req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  const { title, price, description, quantity, category } = req.body;
  const oldOne = await Model.findOne({ title: title });
  if (oldOne) {
    return res
      .status(400)
      .json({ message: "Document with this title already exists" });
  }
  const newOne = new Model({
    title,
    price,
    description,
    quantity,
    category,
  });

  await newOne.save();
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { newOne },
  });
};

const getAll = async (Model, req, res) => {
  const documentsCounts = await Model.countDocuments();
  const apiFeatures = new ApiFeatures(Model.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .sort()
    .search()
    .limitFields();

  //excute query

  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;

  res.json({
    status: httpStatusText.SUCCESS,
    data: {
      results: documents.length,
      pagination: paginationResult,
      data: documents,
    },
  });
};

const getOne = async (Model, populateOptions, req, res) => {
  const id = req.params.id;
  let query = await Model.findById(id);
  if (populateOptions) {
    query = query.populate(populateOptions);
  }
  const document = await query;
  if (!document) {
    res.status(404).json({ message: "Document not found" });
    return;
  }
  res.json({ status: httpStatusText.SUCCESS, data: { document } });
};

const updateOne = async (Model, req, res) => {
  const id = req.params.id;
  const document = await Model.findById(id);
  if (!document) {
    return res.status(404).json({ message: "document not found" });
  } else {
    try {
      let updatedOne = await Model.updateOne(
        { _id: id },
        { $set: { ...req.body } }
      );
      return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { updatedOne },
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "failed to update the document" });
    }
  }
};

const deleteOne = async (Model, req, res) => {
  const id = req.params.id;
  const document = await Model.findById(id);

  if (document) {
    try {
      let deletedOne;
      deletedOne = await Model.deleteOne({ _id: id });
      const documents = await Model.find();
      res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { documents },
      });
    } catch (err) {
      res.status(401).json({ message: "Error deleting document" });
    }
  } else {
    res.status(404).json({ message: "product not found" });
    return;
  }
};

module.exports = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
