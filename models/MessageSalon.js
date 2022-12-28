/* eslint-disable node/handle-callback-err */

// eslint-disable-next-line no-unused-vars
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  const MessageSalon = sequelize.define(
    "MessageSalon",
    {
      idMessageSalon: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      classMethods: {
        associate: function (models) {
          MessageSalon.belongsTo(models.Salon);
          MessageSalon.belongsTo(models.Utilisateur);
        },
      },
    }
  );
  return MessageSalon;
}
