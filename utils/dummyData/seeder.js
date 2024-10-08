// const fs = require("fs");
// require("colors");
// require("dotenv").config();
// const Product = require("../../models/product.model");
// // const dbConnection = require("../../config/dbConnection");

// const url = process.env.MONGO_URL;
// const mongoose = require("mongoose");

// const dbConnection = () => {
//   mongoose
//     .connect(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 60000,
//     })
//     .then(() => {
//       console.log("Connected to MongoDB");
//     });
// };

// module.exports = dbConnection;

// // connect to DB
// // dbConnection();

// // Read data
// const products = JSON.parse(fs.readFileSync("./products.json"));

// // Insert data into DB
// const insertData = async () => {
//   try {
//     await Product.create(products);

//     console.log("Data Inserted".green.inverse);
//     process.exit();
//   } catch (error) {
//     console.log(error);
//   }
// };

// // Delete data from DB
// const destroyData = async () => {
//   try {
//     const batchSize = 1000; // Set the batch size
//     let deletedCount = 0;

//     while (true) {
//       const deleted = await Product.deleteMany(
//         {},
//         { session: null },
//         { batchSize }
//       ); // Use the batch size
//       deletedCount += deleted.deletedCount;
//       console.log(`Deleted ${deletedCount} products`);

//       if (deleted.deletedCount < batchSize) {
//         break; // Exit the loop if the last batch is smaller than the batch size
//       }
//     }
//     console.log("Data Destroyed".red.inverse);
//     process.exit();
//   } catch (error) {
//     console.log(error);
//   }
// };

// // node seeder.js -d
// if (process.argv[2] === "-i") {
//   insertData();
// } else if (process.argv[2] === "-d") {
//   destroyData();
// }
