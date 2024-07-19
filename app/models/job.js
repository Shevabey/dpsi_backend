module.exports = (sequelize, Sequelize) => {
  const Job = sequelize.define("job", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    requirements: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contactInfo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "users", // Use the table name as defined in the User model
        key: "id",
      },
    },
  });

  return Job;
};
