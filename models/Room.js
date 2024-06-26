import { DataTypes } from "sequelize";
import sequelize from "./connection.js";

const Room = sequelize.define("rooms", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_kost: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status:{
        type: DataTypes.ENUM("available", "booked"),
        allowNull: false,
        defaultValue: "available",
    },
    price:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description_room:{
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
    num_room:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: "rooms",
    timestamps: false
})

export default Room;