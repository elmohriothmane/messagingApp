/* eslint-disable node/handle-callback-err */

// eslint-disable-next-line no-unused-vars
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const Utilisateur = sequelize.define(
    "Utilisateur",
    {
      idUtilisateur: {
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
        associate: function (models) {
          Utilisateur.hasMany(models.Chat);
          Utilisateur.belongsToMany(models.Salon, { through: "Utilisateurs_Salons" });
          Utilisateur.hasMany(models.Demande);
           Utilisateur.hasMany(models.DemandeConseiller);
        },
      },
    }
  );
  return Utilisateur
}
