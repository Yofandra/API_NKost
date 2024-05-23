import dotenv from 'dotenv'
dotenv.config()

export default{
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME
}