const {Sequelize, DataTypes, Model} = require("sequelize");
require("dotenv").config({ path: `${process.cwd()}/.env`}); //get the configs from the .env file
const sequelize = new Sequelize(`${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER_HOST}:${process.env.DB_SERVER_PORT}/${process.env.DB_NAME}`);
//we have to import the sequelize which will have a new instance used with the db...


class Type extends Model {};

module.exports = Type.init({
        //attributes for the table
        //this will need to have the business id
        type: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        }
    }, 
    {
        //model options
        sequelize,
        freezeTableName: true
    })

// (async () => {
//     await sequelize.sync({force: true});
//     await TYPE.map((t) => {Type.create(t)})
// })();

