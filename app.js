import express from "express";
const app = express();
import dotenv from "dotenv";
import loggingMiddleware from "./middlewares/loggingMiddleware.js";
import sequelize from "./models/connection.js";
import fileUpload from "express-fileupload";
import cors from "cors";
import profileRoute from "./routes/profile-route.js";
import userRoute from "./routes/user-route.js"
import kostRoute from "./routes/kost-route.js";
import locationRoute from "./routes/location-route.js";
import roomRoute from "./routes/room-route.js";
import roomRequestRoute from "./routes/roomRequest.js"
import reportRoute from "./routes/report-route.js";
import ratingRoute from "./routes/rating-route.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));
app.use(express.static("public"));
app.use(cors());

app.use(loggingMiddleware);
app.get("/", (req, res) => res.json({ msg: "Hello World" }));
app.use("/profile", profileRoute);
app.use('/user', userRoute)
app.use("/kost", kostRoute);
app.use("/location", locationRoute);
app.use("/room", roomRoute);
app.use("/roomRequest", roomRequestRoute);
app.use("/report", reportRoute);
app.use("/rating", ratingRoute);
app.use("/report", reportRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
