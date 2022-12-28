/* eslint-disable node/handle-callback-err */
// eslint-disable-next-line no-unused-vars
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  const Demande = sequelize.define(
    "Demande",
    {
      idDemande: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
      },
    },
    {
      classMethods: {
        associate: function (models) {
          Demande.belongsTo(models.Salon); 
          Demande.belongsTo(models.Utilisateur); 
        },
      },
    }
  );
  return Demande;
}
