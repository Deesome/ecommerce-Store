import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { CartItem } from "../models/cartItem.model.js";
import { Cart } from "../models/cart.model.js";

const addToCart = async(req,res)=>{
    try {
        const userId = req.userId
        console.log("userId",userId)
        const {productId,quantity} = req.body
    
        if(!productId || !quantity || quantity < 1){
            throw new Error("ProductId and Qunatity must be non negative")
        }
    
        const product  = await Product.findById(productId)
        if(!product){
            throw new Error("Product is not found")
        }
        const productTotalPrice = product.price * quantity 
        
        const cart = await Cart.findById(userId).populate("cartItemId")
        if(!cart){
    
            const cartItem = await CartItem.create({
                productId : productId,
                itemQty : quantity,
                totalPrice : productTotalPrice
                
            })
    
            await cartItem.save({validateBeforeSave:false})
    
            const newCart =await Cart.create({
                userId : req.userId,
                cartItemId : [cartItem._id],
                totalPrice : productTotalPrice
            })
    
            await newCart.save({validateBeforeSave:false})
    
            return res.status(200).json({
                message : "Cart Created Successfully",
                cart : newCart
            })
    
        }
    } catch (error) {
        res.status(400).json({ message: error.message || "Error adding to cart" });
        
    }

   

}


export {addToCart}