import { DataTypes } from "sequelize";
import sequelize from "./connection.js";

const Location = sequelize.define("locations", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_kost: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    detail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    village: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subdistrict: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    regency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    point_gmap: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    tableName: "location",
    timestamps: false  
})

export default Location;