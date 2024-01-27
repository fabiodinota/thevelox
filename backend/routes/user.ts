import express, { Request, Response } from "express";
import { getUser } from "../src/controllers/user";

const router = express.Router();

router.get("/getUser/:id", getUser);

export default router;
