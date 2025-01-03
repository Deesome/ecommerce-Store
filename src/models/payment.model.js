import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema({
    orderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Order",
        required : true,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,

    },
    paymentMethod : {
        type : String,
        enum : ["credit card","debit card","cod","upi"],
        default : "upi",
        required:true
    },
    transactionStatus: {
        type: String,
        enum: ["success", "failed", "pending", "cancelled"],
        default: "pending",
    },
    transactionId: {
        type: String, // This will hold the transaction ID from the payment processor
        required: true,
    },
    paymentAmount: {
        type: Number,
        required: true,
        min: [0, "Amount must be positive"],
    },

},{timestamps: true})

paymentSchema.pre("save",async function(next){
    if (this.isNew) {
        const order = await mongoose.model('Order').findById(this.orderId);
        
        if (order) {
            
            this.paymentAmount = order.totalPrice;
        } else {
            const error = new Error("Order not found");
            return next(error);
        }
    }
    
    next();
})

export const Payment = mongoose.model("Payment",paymentSchema)