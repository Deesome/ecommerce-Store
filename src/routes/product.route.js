import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createCategory, createProduct, deleteCategory, deleteProduct, getCategory, getProduct, updateCategory, updateProduct } from "../controllers/product.controller.js";


const productRouter = Router()
productRouter.use(verifyToken)

productRouter.route("/category").post(createCategory)
productRouter.route("/getCategory").get(getCategory)
productRouter.route("/updateCategory/:id").put(updateCategory)
productRouter.route("/deleteCategory/:id").post(deleteCategory)

productRouter.route("/createProduct").post(upload.single("productImage"),createProduct)
productRouter.route("/updateProduct/:id").put(upload.single("productImage"),updateProduct)
productRouter.route("/getProducts").get(getProduct)
productRouter.route("/deleteProduct/:id").post(deleteProduct)



export default productRouter