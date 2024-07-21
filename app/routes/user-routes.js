const { jwtAuth } = require("../middleware/index.js");
const { verifyUser } = require("../middleware");
const userServices = require("../services/user-services.js");
const checkRole = require("../middleware/checkRole");

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

  // Get current user info
  app.get("/api/v1/me", [jwtAuth.verifyToken], userServices.me);

  // User logout
  app.delete("/api/v1/logout", [jwtAuth.verifyToken], userServices.logout);

  // Admin only routes
  app.get(
    "/api/v1/users",
    [[jwtAuth.verifyToken], checkRole(["admin"])],
    userServices.findAllUsers
  );
  app.post(
    "/api/v1/user",
    [[jwtAuth.verifyToken], checkRole(["admin"])],
    userServices.createUser
  );
  app.get(
    "/api/v1/user/:id",
    [[jwtAuth.verifyToken], checkRole(["admin"])],
    userServices.findUserById
  );
  app.patch(
    "/api/v1/user/:id",
    [[jwtAuth.verifyToken], checkRole(["admin"])],
    userServices.updateUser
  );
  app.delete(
    "/api/v1/user/:id",
    [[jwtAuth.verifyToken], checkRole(["admin"])],
    userServices.deleteUser
  );
};
