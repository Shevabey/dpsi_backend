// models/unused-id.js
module.exports = (sequelize, DataTypes) => {
  const UnusedId = sequelize.define("UnusedId", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return UnusedId;
};
