import { DataTypes } from "sequelize";
import sequelize from "./connection.js";

const Rating = sequelize.define("ratings", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_user:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_kost:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    tableName: "ratings",
    timestamps: false
})

export default Rating;