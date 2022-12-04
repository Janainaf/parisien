"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A title for the course is required.",
          },
          notEmpty: {
            msg: "Please provide a title for the course.",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A course description is required.",
          },
          notEmpty: {
            msg: "Please provide a course description.",
          },
        },
      },
      estimatedTime: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Article",
    }
  );

  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };

  return Article;
};
