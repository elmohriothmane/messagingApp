/* eslint-disable node/handle-callback-err */

// eslint-disable-next-line no-unused-vars
const { Model } = require('sequelize')
const bcryptjs = require('bcryptjs')

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

  const hashPassword = async(administrateur) => {
    administrateur.password = await bcryptjs.hash(
        administrateur.password,
        await bcryptjs.genSalt(10)
    );
  };

  Administrateur.addHook("beforeCreate", hashPassword);
  Administrateur.addHook("beforeUpdate", async(administrateur, { fields }) => {
    if (fields.includes("password")) {
        await hashPassword(administrateur);
    }
  });
  
  return Administrateur;
}
