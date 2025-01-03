import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required:true,
        trim : true,
        lowerCase: true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    stockQuantity : {
        type : Number,
        required : true
    },
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required : true
    },
    productImage :{
        type : String,
        required : true
    }
},{timestamps:true})

export const Product = mongoose.model("Product",productSchema)