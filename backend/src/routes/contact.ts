import express from "express";
import { contact } from "../controllers/contact";

const router = express.Router();

router.post("/sendContactForm", contact);

export default router;
