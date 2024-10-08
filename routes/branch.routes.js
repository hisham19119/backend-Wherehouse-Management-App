const express = require("express");
const router = express.Router();
const branchesController = require("../controllers/branches.controller");

router
  .route("/")
  .get(branchesController.getAllBranches)
  .post(branchesController.createBranch);

router
  .route("/:branchId")
  .get(branchesController.getSingleBranch)
  .patch(branchesController.updateBranch)
  .delete(branchesController.deleteBranch);

module.exports = router;
