"use strict";
module.exports = (sequelize, DataTypes) => {
  const House = sequelize.define(
    "House",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: DataTypes.STRING,
      description: DataTypes.TEXT,
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        }
      }
    },
    {}
  );

  return House;
};
