const {Sequelize, DataTypes, Model} = require("sequelize");
const sequelize = new Sequelize("postgres://brandonvasquez:0000@localhost:5432/test");


class Type extends Model {};

Type.init({
    //attributes for the table
    location_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    //model options
    sequelize,
    modelName: "Location",
    freezeTableName: true
})

console.log(Business === sequelize.models.Business);
