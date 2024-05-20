import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth";
import jwtRouter from "./routes/jwt";
import userRouter from "./routes/user";
import mapRouter from "./routes/map";
import contactRouter from "./routes/contact";
import paymentRouter from "./routes/payment";
import ticketRouter from "./routes/ticket";
import routesRouter from "./routes/routes";
import adminRouter from "./routes/admin";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middleware/authenticateToken";
import rateLimit from "express-rate-limit";

dotenv.config();

// Initialize Express
const app: Express = express();
const port = process.env.PORT || 8080;

const corsOptions = {
	origin: process.env.HOST,
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const apiLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 100,
	message: "Too many requests from this IP, please try again later.",
});

app.use("/", apiLimiter);

// Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/jwt", jwtRouter);
app.use("/map", mapRouter);
app.use("/contact", contactRouter);
app.use("/payment", paymentRouter);
app.use("/ticket", ticketRouter);
app.use("/routes", routesRouter);
app.use("/admin", adminRouter);
app.get("/test", (req: Request, res: Response) => {
	res.send({ message: "Test route" });
});

// start the Express server
app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
