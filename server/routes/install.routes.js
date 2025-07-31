import express from "express";
const router = express.Router();
import installController from "../controllers/install.controller.js"; // Add .js extension

router.get("/install", installController.install);

export default router;
