import express, { Router } from "express";
import * as dotenv from "dotenv/config";
import { connectDb } from "./config/db";
import router from "./routes/authRoutes";
import errorHandler from "./middleware/errorMiddleware"
import cookies from "cookie-parser"

dotenv
const PORT = process.env.PORT || 3000;
console.log(process.env.XDG_SESSION_TYPE)

connectDb();
const app = express();

//middleware
app.use(express.json());
app.use(cookies())
app.use("/api", router);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
