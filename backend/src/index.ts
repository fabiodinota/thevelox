import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRouter from "./routes/auth";
import jwtRouter from "./routes/jwt";
import userRouter from "./routes/user";
import mapRouter from "./routes/map";
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

const prisma = new PrismaClient();

app.get("/", async (req: Request, res: Response) => {
	const allUsers = await prisma.users.findMany();
	res.send(allUsers);
	console.log(allUsers);
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/jwt", jwtRouter);
app.use("/map", mapRouter);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
