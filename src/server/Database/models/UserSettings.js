/* // server/database/models/UserSettings.js
import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';

const UserPg = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // If you want Sequelize to auto-increment the ID
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING
});

const UserSettings = sequelize.define('UserSettings', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Users', // This should match the table name Sequelize generates for UserPg
      key: 'id'
    },
  },
  settings: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'UserSettings',
  timestamps: true
});

export default UserSettings;
 */