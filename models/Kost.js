import { DataTypes } from "sequelize";
import sequelize from "./connection.js";

const Kost = sequelize.define("kosts", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name_kost: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description_kost: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url_image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    tableName: "kost",
    timestamps: false  
});

export default Kost;