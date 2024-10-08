const httpStatusText = require("../utils/httpStatusText");
module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return res.status(401).json({
        status: httpStatusText.FAIL,
        message: "this role is not authorized",
      });
    }
    next();
  };
};
