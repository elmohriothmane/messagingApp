/* eslint-disable node/handle-callback-err */

// eslint-disable-next-line no-unused-vars
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  const Administrateur = sequelize.define(
    "Administrateur",
    {
      idAdministrateur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      classMethods: {
        associate: function (models) {},
      },
    }
  );
  return Administrateur;
}
