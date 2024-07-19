const { verifyUser } = require("../middleware");
const userServices = require("../services/user-services.js");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // User registration
  app.post(
    "/api/v1/signup",
    [verifyUser.checkExistingUsername],
    [verifyUser.checkExistingEmail],
    [verifyUser.verifyRole(["applicant", "company"])],
    userServices.signup
  );

  // User login
  app.post("/api/v1/signin", userServices.signin);
};
