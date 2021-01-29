'use strict';
const {
  Model
} = require('sequelize');

const checkDate = require('../helpers/date-validation')

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User, { foreignKey: 'user_id' })
      Todo.belongsTo(models.Project, { foreignKey: 'ProjectId'})
    }
  };
  Todo.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      validate: {
        validateStatus(value) {
          if (value === 'done' || value === 'undone') {
            this.status = value
          } else {
            const code = 400
            throw new Error(['Item status only done/undone!', code])
          }
        }
      }
    },
    due_date: {
      type: DataTypes.DATE,
      validate: {
        validateDate(value) {
          if (checkDate(value) === 'invalid') {
            const code = 400
            throw new Error(['Date should be greater than or equal to today date!', code])
          } else {
            this.due_date = checkDate(value)
          }
        }
      }
    },
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Todo',
    hooks: {
      beforeCreate(todo, options) {
        if(todo.ProjectId === 0) {
          todo.ProjectId = null
        } 
      }
    }
  });
  return Todo;
};