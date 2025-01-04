import { Cart } from "../models/cart.model.js"
import { Order } from "../models/order.model.js"



const createOrder = async(req,res)=>{
    try {
            const incomingUserId = req.userId
            const {cartId} = req.body 
            
            if(!incomingUserId){
                throw new Error("User not Found, Login First")
            }

            const cart = await Cart.findById(cartId).populate("cartItemId")
            if(!cart || cart.userId.toString() !==incomingUserId){
                return res.status(400).json({message : "invalid cart or user"})
            }

            const order = await Order.create({
                userId : incomingUserId,
                cartId,
                orderStatus :"pending"
            })

            res.status(200).json({
                message : "order created Successfully",
                order
            })

            
            
           
        
    } catch (error) {
        res.status(500).json({
            message : error.message || "Error in creating order"
        })
        
    }
}

export {createOrder}