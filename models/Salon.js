/* eslint-disable node/handle-callback-err */
// eslint-disable-next-line no-unused-vars
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  const Salon = sequelize.define(
    "Salon",
    {
      idSalon: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      max: {
        type: DataTypes.INTEGER(100),
        allowNull: false,
      },
    },
    {
      classMethods: {
        associate: function (models) {
          Salon.belongsToMany(models.Utilisateur, { through: "Utilisateurs_Salons" });
          Salon.hasMany(models.Demande)
          Salon.hasMany(models.MessageSalon)
        },
      },
    }
  );
  return Salon;
}
