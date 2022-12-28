/* eslint-disable node/handle-callback-err */

// eslint-disable-next-line no-unused-vars
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      idNotification: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      titre: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      classMethods: {
        associate: function (models) {
          
        },
      },
    }
  );
  return Notification;
}
