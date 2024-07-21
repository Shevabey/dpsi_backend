const jwt = require("jsonwebtoken");
const configuration = require("../config/config-jwt.js");
const database = require("../models");
const User = database.User;

const verifyToken = (req, res, next) => {
  const bearer = req.headers["authorization"];
  if (!bearer) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  const token = bearer.split(" ")[1];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, configuration.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "User unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const jwtAuth = {
  verifyToken: verifyToken,
};

module.exports = jwtAuth;
