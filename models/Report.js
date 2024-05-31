import { DataTypes } from "sequelize";
import sequelize from "./connection.js";

const Report = sequelize.define("reports", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_user:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_room:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false,
    
    }
},{
    tableName: "report",
    timestamps: false
})