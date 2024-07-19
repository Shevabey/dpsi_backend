const database = require("../models");
const User = database.User;

const checkExistingUsername = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Username already used!",
      });
      return;
    }
    next();
  });
};

const checkExistingEmail = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Email already used!",
      });
      return;
    }
    next();
  });
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.body.role)) {
      next();
    } else {
      res.status(403).send({
        message: "Unauthorized role!",
      });
    }
  };
};

const verifyUser = {
  checkExistingUsername: checkExistingUsername,
  checkExistingEmail: checkExistingEmail,
  verifyRole: verifyRole,
};

module.exports = verifyUser;
