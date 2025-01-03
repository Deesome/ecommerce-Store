import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    cartId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Cart",
        required : true

    },
    orderStatus : {
        type : String,
        enum : ["pending","processing","shipped","delivered"],
        default : "pending",
        required : true
    }
},{timestamps:true})

export const Order = mongoose.model("Order",orderSchema)