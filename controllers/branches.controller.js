const httpStatusText = require("../utils/httpStatusText");
let Branche = require("../models/branch.model");
const { validationResult } = require("express-validator");
const appError = require("../utils/appError");

const getAllBranches = async (req, res) => {
  const query = req.query;
  const limit = query.limit || 2;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const branches = await Branche.find({}, { __v: false })
    .limit(limit)
    .skip(skip);
  res.send({ status: httpStatusText.SUCCESS, data: { branches } });
};

const createBranch = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Validation failed",
      Errors: errors.array(),
    });
  }
  const newBranch = new Branche(req.body);
  await newBranch.save();

  res.status(201).json({ status: httpStatusText.SUCCESS, data: { newBranch } });
};

const getSingleBranch = async (req, res) => {
  const branchId = req.params.branchId;
  const branch = await Branche.findById(branchId);
  if (!branch) {
    appError.create("not found branch", 404, httpStatusText);
  }
  res.json({ status: httpStatusText.SUCCESS, data: { branch } });
};

const updateBranch = async (req, res) => {
  const branchId = req.params.branchId;
  let updatedBranch;
  try {
    updatedBranch = await Branche.updateOne(
      { _id: branchId },
      { $set: { ...req.body } }
    );
    if (!Branche) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: { Branche: "Branch NOT Found" },
      });
    } else {
      const branchId = req.params.branchId;
      const branch = await Branche.findById(branchId);
      res
        .status(201)
        .json({ status: httpStatusText.SUCCESS, data: { branch } });
    }
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

const deleteBranch = async (req, res) => {
  const branchId = req.params.branchId;
  let deletedBranch;
  try {
    deletedBranch = await Branche.deleteOne({ _id: branchId });
    if (!Branche) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: { Branche: "Branch NOT Found" },
      });
    }
    const branches = await Branche.find({});
    res
      .status(200)
      .send({ status: httpStatusText.SUCCESS, data: { branches } });
  } catch (err) {
    res.status(400).json({ err: "branch not found" });
  }
};

module.exports = {
  getAllBranches,
  createBranch,
  getSingleBranch,
  updateBranch,
  deleteBranch,
};
