require("dotenv").config();
import express from "express";
import routes from "./routes/cats";

const app = express();
app.use(express.json());
app.use("/", routes);
app.set("port", process.env.PORT || 3000);
export default app;
