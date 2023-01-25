/* eslint-disable node/handle-callback-err */

// eslint-disable-next-line no-unused-vars
const { Model } = require('sequelize')
const bcryptjs = require('bcryptjs')


module.exports = (sequelize, DataTypes) => {
  const Conseiller = sequelize.define(
    "Conseiller",
    {
      idConseiller: {
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
      available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue : true,
      },
    },
    {
      classMethods: {
        associate: function (models) {
          Conseiller.hasMany(models.Chat);
        },
      },
    }
  );

  const hashPassword = async(conseiller) => {
    conseiller.password = await bcryptjs.hash(
        conseiller.password,
        await bcryptjs.genSalt(10)
    );
  };

  Conseiller.addHook("beforeCreate", hashPassword);
  Conseiller.addHook("beforeUpdate", async(conseiller, { fields }) => {
    if (fields.includes("password")) {
        await hashPassword(conseiller);
    }
  });

  return Conseiller;
}
