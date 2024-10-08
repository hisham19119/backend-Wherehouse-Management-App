const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
const userController = require("../controllers/users.controller");
const {
  updateUserValidator,
  createUserValidator,
} = require("../middlewares/validators/user.validation");
const allowedTo = require("../middlewares/allowedTo");
const userRoles = require("../utils/usersRoles");
router
  .route("/")
  .post(verifyToken, createUserValidator(), userController.createUser)
  .get(verifyToken, userController.getAllUsers);

router
  .route("/:userId")
  .get(verifyToken, userController.getSingleUser)
  .patch(
    verifyToken,
    allowedTo(userRoles.ADMIN),
    updateUserValidator(),
    userController.updateUser
  )
  .delete(verifyToken, allowedTo(userRoles.ADMIN), userController.deleteUser);

router.route("/login").post(userController.logIn);
router.route("/logout").post(verifyToken, userController.logOut);

module.exports = router;
