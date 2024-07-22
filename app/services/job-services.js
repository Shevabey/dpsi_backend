const db = require("../models/index");
const Job = db.Job;
const UnusedId = db.UnusedId;
// const Op = db.Sequelize.Op;

// Add new job
exports.create = async (req, res) => {
  try {
    // Cek ID yang kosong terlebih dahulu
    const unusedId = await UnusedId.findOne({ where: { entityType: "job" } });

    let newJobId;
    if (unusedId) {
      newJobId = unusedId.entityId;
      await UnusedId.destroy({ where: { id: unusedId.id } });
    } else {
      // Jika tidak ada ID yang kosong, buat ID baru
      const lastJob = await Job.findOne({ order: [["id", "DESC"]] });
      newJobId = lastJob ? lastJob.id + 1 : 1;
    }

    const job = await Job.create({
      id: newJobId,
      title: req.body.title,
      description: req.body.description,
      requirements: req.body.requirements,
      contactInfo: req.body.contactInfo,
      isDeleted: req.body.isDeleted ? req.body.isDeleted : false,
      userId: req.userId,
    });

    res.status(201).send(job);
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message || "Error when adding a job!" });
  }
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
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Job.destroy({ where: { id: id } });
    if (num == 1) {
      await UnusedId.create({ entityId: id, entityType: "job" });
      res.send({ message: "Job was deleted successfully!" });
    } else {
      res.send({
        message: `Cannot delete Job with id=${id}. Maybe Job was not found!`,
      });
    }
  } catch (err) {
    res.status(500).send({ message: "Could not delete Job with id=" + id });
  }
};
function validateRequest(req) {
  if (!req.body) {
    res.status(400).send({
      message: "Request is empty!",
    });
    return;
  }
}
