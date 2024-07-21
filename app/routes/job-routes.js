const { jwtAuth } = require("../middleware/index.js");
const jobServices = require("../services/job-services.js");
const checkRole = require("../middleware/checkRole");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // Add a job
  app.post(
    "/api/auth/addjob",
    [jwtAuth.verifyToken, checkRole(["company", "admin"])],
    jobServices.create
  );

  // Find all jobs
  app.get(
    "/api/auth/getjobs",
    [jwtAuth.verifyToken, checkRole(["company", "admin"])],
    jobServices.findAll
  );

  // Find job by job id
  app.get(
    "/api/auth/:id",
    [jwtAuth.verifyToken, checkRole(["company", "admin"])],
    jobServices.findOne
  );

  // Update job by job id
  app.patch(
    "/api/auth/:id",
    [jwtAuth.verifyToken, checkRole(["company", "admin"])],
    jobServices.update
  );

  // Delete job by job id
  app.delete(
    "/api/auth/:id",
    [jwtAuth.verifyToken, checkRole(["company", "admin"])],
    jobServices.delete
  );

  // Common routes for company and admin
  app.get(
    "/api/auth/jobs",
    [[jwtAuth.verifyToken], checkRole(["company", "admin"])],
    jobServices.findAll
  );
  app.post(
    "/api/auth/job",
    [[jwtAuth.verifyToken], checkRole(["company", "admin"])],
    jobServices.create
  );
  app.get(
    "/api/auth/job/:id",
    [[jwtAuth.verifyToken], checkRole(["company", "admin"])],
    jobServices.findOne
  );
  app.patch(
    "/api/auth/job/:id",
    [[jwtAuth.verifyToken], checkRole(["company", "admin"])],
    jobServices.update
  );
  app.delete(
    "/api/auth/job/:id",
    [[jwtAuth.verifyToken], checkRole(["company", "admin"])],
    jobServices.delete
  );

  // Routes for applicants and admin
  app.get(
    "/api/jobs",
    [[jwtAuth.verifyToken], checkRole(["applicant", "admin"])],
    jobServices.findAll
  );
  app.get(
    "/api/job/:id",
    [[jwtAuth.verifyToken], checkRole(["applicant", "admin"])],
    jobServices.findOne
  );
};
