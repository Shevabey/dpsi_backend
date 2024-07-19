const { jwtAuth } = require("../middleware/index.js");
const jobServices = require("../services/job-services.js");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // Add a job
  app.post("/api/auth/addjob", [jwtAuth.verifyToken], jobServices.create);

  // Find all jobs
  app.get("/api/auth/getjobs", [jwtAuth.verifyToken], jobServices.findAll);

  // Find job by job id
  app.get("/api/auth/:id", [jwtAuth.verifyToken], jobServices.findOne);

  // Update job by job id
  app.patch("/api/auth/:id", [jwtAuth.verifyToken], jobServices.update);

  // Delete job by job id
  app.delete("/api/auth/:id", [jwtAuth.verifyToken], jobServices.delete);
};
