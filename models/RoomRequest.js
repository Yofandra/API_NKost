import { DataTypes } from "sequelize";
import sequelize from "./connection.js";

const RoomRequest = sequelize.define("room_requests", {
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
    status:{
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
    }
},{
    tableName: "room_request",
    timestamps: false
})