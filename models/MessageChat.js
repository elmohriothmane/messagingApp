/* eslint-disable node/handle-callback-err */

// eslint-disable-next-line no-unused-vars
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  const MessageChat = sequelize.define(
    "MessageChat",
    {
      idMessageChat: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      classMethods: {
        associate: function (models) {
          MessageChat.belongsTo(models.Utilisateur);
          MessageChat.belongsTo(models.Conseiller);
          MessageChat.belongsTo(models.Chat);
        },
      },
    }
  );
  return MessageChat;
}
