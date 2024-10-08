const User = require("../models/user.model");
const appError = require("../utils/appError");
const bcrypt = require("bcrypt");
const httpStatusText = require("../utils/httpStatusText");
const generateJWT = require("../utils/generate.JWT");

const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: { message: "User with this email already exists" },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    role,
  });
  await newUser.save();

  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
  res.status(201).json({ status: httpStatusText.SUCCESS, data: { newUser } });
};

const getAllUsers = async (req, res) => {
  const query = req.query;
  const limit = query.limit || 3;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find({ __v: false }).limit(limit).skip(skip);
  res.send({ status: httpStatusText.SUCCESS, data: { users } });
};

const getSingleUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) {
    appError.create("not found user", 404, httpStatusText);
    const error = new Error();
    return next(error);
  }
  res.send({ status: httpStatusText.SUCCESS, data: { user } });
};

const updateUser = async (req, res) => {
  const userId = req.params.userId;
  let updatedUser;
  try {
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }
    updatedUser = await User.updateOne(
      { _id: userId },
      { $set: { ...req.body } }
    );
    if (!User) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: { User: "User not found" },
      });
    } else {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      res.status(201).json({ status: httpStatusText.SUCCESS, data: { user } });
    }
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  let deletedUser;
  try {
    deletedUser = await User.deleteOne({ _id: userId });
    if (deletedUser.deletedCount === 1) {
      const users = await User.find();
      return res.status(200).json({
        status: httpStatusText.FAIL,
        data: { users },
      });
    } else {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: { message: "User not found" },
      });
    }
  } catch (err) {
    res.status(400).json({ Massage: "user not deleted" });
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: { message: "email and password are required" },
    });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: { user: "user not found" },
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  } else {
    return res.status(401).json({
      status: httpStatusText.FAIL,
      data: { message: "password or email is not correct" },
    });
  }
};

const logOut = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: httpStatusText.ERROR,
        error: "User not found",
      });
    }
    await User.updateOne({ _id: userId }, { $set: { token: null } });
    await user.save();
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { message: "Logged out successfully" },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to log out" });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getSingleUser,
  logIn,
  logOut,
};
