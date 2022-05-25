import express, { Express } from "express";
import routes from "./routes/cats";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
app.use("/", routes);
app.set("port", process.env.PORT || 3000);

export default app;
