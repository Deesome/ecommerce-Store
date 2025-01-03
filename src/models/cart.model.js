import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true

    },
    cartItemId : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "CartItem",
        required : true
    }],
    totalPrice: {
        type: Number,
        default: 0,                   
      },
},{timestamps:true})

export const Cart = mongoose.model("Cart",cartSchema)