/* eslint-disable node/handle-callback-err */

// eslint-disable-next-line no-unused-vars
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const DemandeConseiller = sequelize.define(
    "DemandeConseiller",
    {
      idDemande: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      classMethods: {
        associate: function (models) {
        DemandeConseiller.belongsTo(models.Utilisateur);
        },
      },
    }
  );
  return DemandeConseiller;
}
