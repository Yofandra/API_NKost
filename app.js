import express from "express";
const app = express();
import dotenv from "dotenv";
import connection from "./models/connection.js";
import loggingMiddleware from "./middlewares/loggingMiddleware.js";
import sequelize from "./models/connection.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggingMiddleware);
app.get("/", (req, res) => res.json({ msg: "Hello World" }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// connection.getConnection((err) => {
//   if (err) {
//     console.log("Error connecting to mysql :", err);
//     server.close();
//   } else {
//     console.log("Connect to mysql successfully");
//   }
// });

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
