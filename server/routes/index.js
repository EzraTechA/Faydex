import express from 'express';
// Call the router method from express to create the router
const router = express.Router();
// Import the install router
import installRouter from "./install.routes.js";


router.use(installRouter);
export default router; 