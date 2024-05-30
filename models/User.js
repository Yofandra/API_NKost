import {DataTypes } from "sequelize";
import sequelize from "./connection.js";

const User = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("tenant", "owner", "admin"),
        allowNull: false,
        defaultValue: "tenant",
    },
    last_login: {
        type: DataTypes.DATE,
    },
},{
    tableName: "users",
    timestamps: false  
}
);

export default User;