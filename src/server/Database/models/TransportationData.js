import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';

const TransportationData = sequelize.define('TransportationData', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uniqueId: {
      type: DataTypes.STRING,  // Add this field to store the frontend-generated unique ID
      unique: true  // Ensure uniqueness across the table
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data: {
      type: DataTypes.JSON,
      
    }
  }, {
    tableName: 'TransportationData'
  });
  
  export default TransportationData;
  