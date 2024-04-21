import { Router } from "express";
import { refreshJWTToken } from "../controllers/refreshJWTToken";

const router = Router();

router.get("/refresh", refreshJWTToken);

export default router;
