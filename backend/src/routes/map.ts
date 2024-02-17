import express from "express";
import { search, getDestinations } from "../controllers/map";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/search", authenticateToken, search);
router.get("/getDestinations", authenticateToken, getDestinations);

export default router;
