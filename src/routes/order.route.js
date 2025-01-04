import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/order.controller.js";


const orderRouter = Router()
orderRouter.use(verifyToken)

orderRouter.route("/createOrder").post(createOrder)





export default orderRouter