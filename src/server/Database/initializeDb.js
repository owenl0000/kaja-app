// server/database/initializeDb.js
import sequelize from './sequelize';
import Plan from './models/Plan';

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    await Plan.sync();  // Ensure the Plan table is created
    console.log('Plan table has been successfully created.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initializeDatabase();
