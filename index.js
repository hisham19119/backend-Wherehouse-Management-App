require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const branchRouter = require("./routes/branch.routes");
const userRouter = require("./routes/user.routes");
const productRouter = require("./routes/products.routes");
const categoryRouter = require("./routes/categories.routes");
const dbConnection = require("./config/dbConnection");

dbConnection();
app.use(express.json());
app.use("/api/branches", branchRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
