import { DataTypes } from "sequelize";
import sequelize from "./connection.js";
import Report from "./Report.js";
import Room from "./Room.js";
import Kost from "./Kost.js";

Kost.hasMany(Room, { foreignKey: 'id_kost' });
Room.belongsTo(Kost, { foreignKey: 'id_kost' });
Room.hasMany(Report, { foreignKey: 'id_room' });
Report.belongsTo(Room, { foreignKey: 'id_room' });

export { Room, Kost, Report };