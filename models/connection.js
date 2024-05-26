// import mysql from 'mysql'
// import dbConfig from '../configs/dbConfig.js'

// const connection = mysql.createPool({
//     host: dbConfig.HOST,
//     user: dbConfig.USER,
//     password: dbConfig.PASSWORD,
//     database: dbConfig.DB
// })

// export default connection

import dbConfig from "../configs/dbConfig.js";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
});    

export default sequelize;