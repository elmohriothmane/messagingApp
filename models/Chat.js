/* eslint-disable node/handle-callback-err */

// eslint-disable-next-line no-unused-vars
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    "Chat",
    {
      idChat: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },

    {
      classMethods: {
        associate: function (models) {
          Chat.belongsTo(models.Utilisateur);
          Chat.belongsTo(models.Conseiller);
          Chat.hasMany(models.MessageChat);
          //  console.log("Account has one User!");
        },
      },
    }
  );
  return Chat
}
