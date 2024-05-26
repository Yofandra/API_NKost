import express from "express";
const app = express();
import dotenv from "dotenv";
import loggingMiddleware from "./middlewares/loggingMiddleware.js";
import sequelize from "./models/connection.js";
import profileRoute from "./routes/profile-route.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggingMiddleware);
app.get("/", (req, res) => res.json({ msg: "Hello World" }));
app.use("/profile", profileRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
