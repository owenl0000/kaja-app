const {Sequelize, DataTypes, Model} = require("sequelize");
const sequelize = new Sequelize("postgres://brandonvasquez:0000@localhost:5432/test");


class Business extends Model {};

Business.init({
    //attributes for the table
    business_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    business_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    business_image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    business_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    business_reviews: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    business_rating: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    business_location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    business_phone: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    //model options
    sequelize,
    modelName: "Business",
    freezeTableName: true
})

//form association through the location.....
Business.associate = (models) => {
    models.Business.hasMany();
}

console.log(Business === sequelize.models.Business);
