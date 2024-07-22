// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const database = require("../models");
const configuration = require("../config/config-jwt.js");
const User = database.User;
const UnusedId = database.UnusedId;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  console.log("Request : ", req.body);
  validateRequest(req);

  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role,
  })
    .then(() => {
      res.send({ message: "User successfully registered" });
    })
    .catch((exception) => {
      res.status(500).send({ message: exception.message });
    });
};

exports.signin = (req, res) => {
  validateRequest(req);

  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid password!",
        });
      }

      // Set expired token in 1 day (24 hours)
      const token = jwt.sign({ id: user.id }, configuration.secret, {
        expiresIn: 86400, // 24 hours in seconds
      });

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.me = (req, res) => {
  const userId = req.userId;

  User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.logout = (req, res) => {
  // Hanya set null pada token, client-side akan bertanggung jawab untuk menghapus token dari penyimpanan
  req.headers["authorization"] = null;
  res.status(200).send({ message: "Successfully logged out" });
};

// Tambahkan fungsi-fungsi baru untuk admin only routes
exports.findAllUsers = (req, res) => {
  User.findAll()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.createUser = async (req, res) => {
  try {
    // Cek ID yang kosong terlebih dahulu
    const unusedId = await UnusedId.findOne({ where: { entityType: "user" } });

    let newUserId;
    if (unusedId) {
      newUserId = unusedId.entityId;
      await UnusedId.destroy({ where: { id: unusedId.id } });
    } else {
      // Jika tidak ada ID yang kosong, buat ID baru
      const lastUser = await User.findOne({ order: [["id", "DESC"]] });
      newUserId = lastUser ? lastUser.id + 1 : 1;
    }

    const user = await User.create({
      id: newUserId,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role,
    });

    res.status(201).send({ message: "User successfully registered" });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User.",
    });
  }
};

exports.findUserById = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

exports.updateUser = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await User.destroy({ where: { id: id } });
    if (num == 1) {
      await UnusedId.create({ entityId: id, entityType: "user" });
      res.send({ message: "User was deleted successfully!" });
    } else {
      res.send({
        message: `Cannot delete User with id=${id}. Maybe User was not found!`,
      });
    }
  } catch (err) {
    res.status(500).send({ message: "Could not delete User with id=" + id });
  }
};

function validateRequest(req) {
  if (!req.body) {
    res.status(400).send({
      message: "Request can't be empty!",
    });
    return;
  }
}
