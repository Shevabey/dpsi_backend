const db = require("../models/index");
const Job = db.Job;
// const Op = db.Sequelize.Op;

// Add new job
exports.create = (req, res) => {
  console.log("Request : ", req.body);
  validateRequest(req);

  const job = {
    title: req.body.title,
    description: req.body.description,
    requirements: req.body.requirements,
    contactInfo: req.body.contactInfo,
    isDeleted: req.body.isDeleted ? req.body.isDeleted : false,
    userId: req.userId, // Assuming the authenticated user is creating the job
  };

  Job.create(job)
    .then((data) => {
      res.send({ msg: "Add job Succesfuly" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error when adding a job!",
      });
    });
};

// Find all jobs
exports.findAll = (req, res) => {
  Job.findAll({ where: { isDeleted: false } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error when getting all jobs!",
      });
    });
};

// Find job by job id
exports.findOne = (req, res) => {
  const id = req.params.id; // Mengambil id dari parameter URL
  Job.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Job not found!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error when getting job by id :  ${id},`,
      });
    });
};

// Update job by job id
exports.update = (req, res) => {
  const id = req.params.id; // Mengambil id dari parameter URL
  Job.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Job successfully updated.",
        });
      } else {
        res.send({
          message:
            "Update process failed. Job not found or no changes were made.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error updating job with id : ${id},`,
      });
    });
};

// Delete job by job id
exports.delete = (req, res) => {
  const id = req.params.id; // Mengambil ID dari parameter URL

  Job.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Job successfully deleted.",
        });
      } else {
        res.send({
          message: "Delete process failed!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Couldn't delete job with id : ${id},`,
      });
    });
};
function validateRequest(req) {
  if (!req.body) {
    res.status(400).send({
      message: "Request is empty!",
    });
    return;
  }
}
