import express from "express";
import { getUser } from "../controllers/user";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/getUser", authenticateToken, getUser);

export default router;
