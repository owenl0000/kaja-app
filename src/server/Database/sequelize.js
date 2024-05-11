// server/database/sequelize.js
import { Sequelize } from "sequelize";
import pg from 'pg';

const databaseName = process.env.DB_NAME_P;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_SERVER_HOST;
const port = process.env.DB_SERVER_PORT;
const dialect = process.env.DB_DIALECT;
console.log(databaseName);

const connectionString = `${dialect}://${username}:${password}@${host}:${port}/${databaseName}`;
console.log(connectionString);
const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectModule: pg,
  define: {
    freezeTableName: true
  }
});

async function setupDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Postgres Connection has been established successfully.');
    // Sync all defined models to the database
    await sequelize.sync({ alter: true }); // Use 'alter' for development to adjust tables as per model changes without dropping them
    console.log('Postgres Database synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

setupDatabase();

export default sequelize;