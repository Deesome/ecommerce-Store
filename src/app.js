import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"



const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN ,
    credentials: true
}))




app.use(express.json())
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())




import userRouter from "./routes/user.route.js" 
import productRouter from "./routes/product.route.js"
import cartRouter from "./routes/cart.route.js"
import orderRouter from "./routes/order.route.js"

app.use("/user",userRouter)
app.use("/product",productRouter)
app.use("/cart",cartRouter)
app.use("/order",orderRouter)









export default app 