import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { addToCart } from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.use(verifyToken)

cartRouter.route("/addtocart").post(addToCart)


export default cartRouter