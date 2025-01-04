
import { Product } from "../models/product.model.js";
import { CartItem } from "../models/cartItem.model.js";
import { Cart } from "../models/cart.model.js";

const addToCart = async(req,res)=>{
    try {
        const incomingUserId = req.userId
        console.log("incomingUserId",incomingUserId)
        const {productId,quantity} = req.body
    
        if(!productId || !quantity || quantity < 1){
            throw new Error("ProductId and Qunatity must be non negative")
        }
    
        const product  = await Product.findById(productId)
        if(!product){
            throw new Error("Product is not found")
        }
        const productTotalPrice = product.price * quantity 
        
        const cart = await Cart.findOne({userId:incomingUserId}).populate("cartItemId")
        console.log(cart)
        if(!cart){
    
            const cartItem = await CartItem.create({
                productId : productId,
                itemQty : quantity,
                totalPrice : productTotalPrice
                
            })
    
            await cartItem.save({validateBeforeSave:false})
    
            const newCart =await Cart.create({
                userId : incomingUserId,
                cartItemId : [cartItem._id],
                totalPrice : productTotalPrice
            })
    
            await newCart.save({validateBeforeSave:false})
    
            return res.status(200).json({
                message : "Cart Created Successfully",
                cart : newCart
            })
    
        }

        const existingCartItem = cart.cartItemId.find((item)=> item.productId.toString() === productId)
        if(existingCartItem){
            existingCartItem.itemQty += quantity 
            existingCartItem.totalPrice += productTotalPrice
            await existingCartItem.save({validateBeforeSave:false})
        }else{
            const newCartItem = await CartItem.create({
                itemQty: quantity,
                productId: productId,
                totalPrice: productTotalPrice,
            });
            await newCartItem.save();

            cart.cartItemId.push(newCartItem._id)
        }

        const cartPrice =  cart.cartItemId.reduce((accumulator,currentItem)=>accumulator+currentItem.totalPrice,0)
        console.log(cartPrice)
        cart.totalPrice = cartPrice
        await cart.save({validateBeforeSave:false})
        
        res.status(200).json({
            message : "cart item added to cart Successfully",
            cart
        })
    } catch (error) {
        res.status(400).json({ message: error.message || "Error adding to cart" });
        
    }

   

}


export {addToCart}