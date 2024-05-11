import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';

const Plan = sequelize.define('Plan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  details: {
    type: DataTypes.JSON,  
  },
  index: {
    type: DataTypes.INTEGER,  // Add this to store the order of places
  },
  uniqueId: {
    type: DataTypes.STRING,  
    unique: true  
  },
  placesData: {
    type: DataTypes.JSON,  // User inputs specific to places including budget, timeFrame, and userNotes
    
  },
  date: {
    type: DataTypes.STRING,  
    allowNull: false
  }
}, {
  tableName: 'Plans'
});

export default Plan;
