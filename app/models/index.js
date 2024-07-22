const configuration = require("../config/config-db.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  configuration.DB,
  configuration.USER,
  configuration.PASSWORD,
  {
    host: configuration.HOST,
    dialect: configuration.dialect,
    pool: {
      max: configuration.pool.max,
      min: configuration.pool.min,
      acquire: configuration.pool.acquire,
      idle: configuration.pool.idle,
    },
  }
);

const database = {};
database.Sequelize = Sequelize;
database.sequelize = sequelize;
database.User = require("./user.js")(sequelize, Sequelize);
database.Job = require("./job.js")(sequelize, Sequelize);
database.UnusedId = require("./unused-id.js")(sequelize, Sequelize);

// Define associations
database.User.hasMany(database.Job, { foreignKey: "userId" });
database.Job.belongsTo(database.User, { foreignKey: "userId" });

module.exports = database;
