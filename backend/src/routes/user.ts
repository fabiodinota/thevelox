import express from "express";
import { getUser } from "../controllers/user";

const router = express.Router();

router.get("/getUser/:id", getUser);

export default router;
