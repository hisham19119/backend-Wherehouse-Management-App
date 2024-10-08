const url = process.env.MONGO_URL;
const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect(url).then(() => {
    console.log("Connected to MongoDB");
  });
};

module.exports = dbConnection;

// const mongoose = require("mongoose");

// const dbConnection = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected".cyan.underline.bold);
//   } catch (error) {
//     console.log(error.message.red);
//     process.exit(1);
//   }
// };

// module.exports = dbConnection;
