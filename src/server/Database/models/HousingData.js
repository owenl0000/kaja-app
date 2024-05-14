import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';

const HousingData = sequelize.define('HousingData', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data: {
      type: DataTypes.JSON,
      
    }
  }, {
    tableName: 'HousingData'
  });
  
  export default HousingData;
  