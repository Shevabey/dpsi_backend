const database = require("../models");
const User = database.User;

const checkRole = (roles) => (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      if (user && roles.includes(user.role)) {
        next();
      } else {
        res.status(403).send({
          message:
            "Access denied: You do not have the required role to access this resource.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not validate user role.",
      });
    });
};

module.exports = checkRole;
