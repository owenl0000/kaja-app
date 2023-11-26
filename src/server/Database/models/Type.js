const {Sequelize, DataTypes, Model} = require("sequelize");
require("dotenv").config({ path: `${process.cwd()}/.env`}); //get the configs from the .env file
const sequelize = new Sequelize(process.env.DB_CONNECT_STRING);
//we have to import the sequelize which will have a new instance used with the db...


    class Type extends Model {};

    Type.init({
        //attributes for the table
        //this will need to have the business id
        type: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        }
    }, {
        //model options
        sequelize,
        freezeTableName: true
    })
    Type.associate = (models) => {
        models.Type.belongsTo(models.Business);
        //this will add a business_id column to Type
    }
    const TYPE = [
        {business_id: "cF1k0Y1tgCf4AMEaNU3_yA", type: ["foodtrucks", "latin"]}
    ];

(async () => {
    await sequelize.sync({force: true});
    await TYPE.map((t) => {Type.create(t)})
})();

