import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRouter from "./routes/auth";
import jwtRouter from "./routes/jwt";
import userRouter from "./routes/user";
import mapRouter from "./routes/map";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import { authenticateToken } from "./middleware/authenticateToken";

// Load environment variables from .env file
dotenv.config();

// Initialize Express
const app: Express = express();
const port = process.env.PORT || 8080;

// Cors and body parser middleware
const corsOptions = {
    origin: process.env.HOST, // Allow only this origin to send requests with credentials
    credentials: true, // Allow credentials (cookies, HTTP authentication) to be sent with requests
  };
  
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Initialize Prisma
const prisma = new PrismaClient();

// A sample route
app.get("/", authenticateToken, async (req: Request, res: Response) => {
	const allUsers = await prisma.users.findMany();
	res.send(allUsers);
	console.log(allUsers);
});

// Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/jwt", jwtRouter);
app.use("/map", mapRouter);

// start the Express server
app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
