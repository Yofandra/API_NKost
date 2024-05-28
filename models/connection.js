import dbConfig from "../configs/dbConfig.js";
import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    dialectModule: mysql2,
});    

export default sequelize;