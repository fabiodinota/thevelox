import express from "express";
import { search } from "../controllers/map";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/search", authenticateToken, search);

export default router;
