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
        type: DataTypes.ENUM("penyewa", "pemilik", "admin"),
        allowNull: false,
        defaultValue: "penyewa",
    },
    status: {
        type: DataTypes.ENUM("pending", "active"),
        allowNull: false,
        defaultValue: "pending",
    },
    last_login: {
        type: DataTypes.DATE,
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},{
    tableName: "users",
    timestamps: false  
}
);

export default User;