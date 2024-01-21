import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { PrismaClient } from '@prisma/client'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const prisma = new PrismaClient()

app.get("/", async (req: Request, res: Response) => {
    const allUsers = await prisma.users.findMany()
    res.send(allUsers);
    console.log(allUsers)
});

app.post("/auth/signup", async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const newUser = await prisma.users.create({
        data: {
            username,
            email,
            password
        }
    });
    res.send(newUser);
    console.log(newUser)
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});