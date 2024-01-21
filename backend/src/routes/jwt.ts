import { Router } from "express";
import { refreshJWTToken } from "../controllers/refreshJWTToken";

const router = Router();

router.post("/refresh", refreshJWTToken);

export default router;
