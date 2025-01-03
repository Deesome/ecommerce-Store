import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema({
    itemQty : {
        type : Number,
        required : true,
        min : [1,"Qunatity must be atleast 1"]
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : true
    },
    totalPrice : {
        type :Number,
        required :true,
        min : [0,"Price must be Positive"]
    },

},{timestamps:true})

export const CartItem = mongoose.model("CartItem",cartItemSchema)