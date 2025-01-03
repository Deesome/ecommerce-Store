import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const createCategory = async(req,res)=>{
    try {
        const {name,description} = req.body 
    
        if(name == "" && description == ""){
            throw new Error("All fields are required")
        }
    
       const category =  await Category.create({
            name,
            description
        })
    
        res.status(200).json({
            message : "category created Successfully",
            category
        })
    } catch (error) {
        res.status(401).json({
            message : error.message
        })
        
    }


}
const updateCategory = async(req,res)=>{
    try {
        const {id} = req.params
        const {name,description} = req.body

        if(!id){
            throw new Error("Category Id is required")
        }

        const category = await Category.findById(id)
        if(!category){
            throw new Error("Category is not found")
        }

        if(name) category.name = name
        if(description) category.description = description
        
        const newCategory = await category.save({validateBeforeSave:false})

        res.status(200).json({
            message : "Category SuccessFully Updated",
            newCategory
        })

        
    } catch (error) {
        res.status(401).json({
            message : error.message || "Error in update category Controller"
        })
        
    }
}

const deleteCategory = async(req,res)=>{
    try {
        const {id} = req.params
        if(!id){
            throw newError("Category Id is Required")
        }
    
        const deletedcategory = await Category.findByIdAndDelete(id)
        if(!deletedcategory){
            throw new Error("Error in deleting the category")
        }
    
        res.status(200).json({
            message : "categopry deleted Successfully"
        })
    } catch (error) {
        res.status(401).json({
            message : error.message || "Error in delete Category"
        })
        
    }
}

const getCategory = async(req,res)=>{
    try {
       const categories =  await Category.find()

       res.status(200).json({
        message : "Categories fetched Successfully",
        categories
       })
        
    } catch (error) {
        res.status(400).json({ message: "Error while fetching categories" });
        
    }
}
const createProduct = async(req,res)=>{
   try {
     const {name,description,price,stockQuantity,categoryId}=req.body
 
     if([name,description,price,stockQuantity,categoryId].some(field => !field)){
         throw new Error("All field sare required")
     }
    
     const parsedPrice = Number(price)
     const parsedStockQuantity = Number(stockQuantity)
     

     if(!Number.isFinite(parsedPrice) || parsedPrice <= 0){
        throw new Error("Price must be a positive Number")
     }

     if(!Number.isFinite(parsedStockQuantity) || parsedStockQuantity < 0){
        throw new Error("Stock Qunatity must be a nOn negative Number")
     }

     if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error("Invalid categoryId");
      }
 
    const existingProduct =  await Product.findOne({name : name.toLowerCase()})
    if(existingProduct){
     throw new Error("Product already Exist")
    }
 
    const productImagePath = req.file?.path
    console.log(productImagePath)
    if(!productImagePath){
     throw new Error("Product Image is required")
    }
 
    const productImage = await uploadCloudinary(productImagePath)
    
    if(!productImage){
     throw new Error("Error while uploading on Cloudinatry")
    }
 
    const product = await Product.create({
     name,
     description,
     price : parsedPrice,
     stockQuantity: parsedStockQuantity,
     categoryId,
     productImage : productImage.url
    })
 
    if(!product){
     throw new Error("Error while creating Product")
    }
 
    res.status(200).json({
     message : "Product Created Successfully",
     product
    })
   } catch (error) {
    res.status(401).json({
        message : error.message || "Error Ocurred in createProdcut Controller"
    })
    
   }
}

const getProduct = async(req,res)=>{
    try {
        const { category,
            minPrice,
            maxPrice,
            } = req.query;

            

            const query ={}

            if(category){
                query.categoryId = category
            }

            if(minPrice || maxPrice){
                query.price ={}
                if(minPrice) query.price.$gte = Number(minPrice)
                if(maxPrice) query.price.$lte = Number(maxPrice)
            }


        const product = await Product.find(query).populate('categoryId')
        res.status(200).json({
            message : "All Products successfully Fetched",
            product
        })
    } catch (error) {
        res.status(500).json({
            message : error.message || "Error occured while fetching product"
        })
        
    }
}

const updateProduct = async(req,res)=>{
    try {
        const {id} = req.params
        
        if(!id){
            throw new Error("Product id is required")
        }
        const {name,description,price,stockQuantity,categoryId} = req.body
        const productImagePath = req.file?.path
        
       
    
        const product = await Product.findById(id)
        if(!product){
            throw new Error("Product does not exist")
        }
    
        if(name) product.name =name
        if(description) product.description = description
        if(categoryId) product.categoryId = categoryId

        if(price){
            const parsedPrice = Number(price)
            if(!Number.isFinite(parsedPrice) || parsedPrice <= 0){
                throw new Error("Price must be a positive Number")
             }
             product.price = parsedPrice
        }
        if(stockQuantity){
            const parsedStockQuantity = Number(stockQuantity)
            if(!Number.isFinite(parsedStockQuantity) || parsedStockQuantity < 0){
                throw new Error("Stock Qunatity must be a nOn negative Number")
             }
             product.stockQuantity = parsedStockQuantity
        }
    
        if(productImagePath){
            try {
                const productImage = await uploadCloudinary(productImagePath)
                if(!productImage){
                    throw new Error("Error whiile uploading on Cloudinary")
                }
                console.log("Product Image is uploaded Successfully")
    
                product.productImage = productImage.url
                
            } catch (error) {
                console.log("Errro Message",error.message)
                
                
            }
        }
    
        const newProduct = await product.save({validateBeforeSave:false})
    
        res.status(200).json({
            message : "Product Updated SuccessFully",
            newProduct
        })
    } catch (error) {
        res.status(401).json({
            Message : error.message || "Error in update product Controller"
        })
        
    }



   


}

const deleteProduct = async(req,res)=>{
   try {
     const {id} = req.params
    
     if(!id){
         throw new Error("Product Id is Required")
     }
 
    const deletedProduct =  await Product.findByIdAndDelete(id)
 
     if(!deletedProduct){
         throw new Error("Product delete Failed")
    }
    res.status(200).json({
         message : " Product Successfully Deleted"
    })
   } catch (error) {
      res.status(401).josn({
        message:error.message || "Error occured in delete product"
      })
    
   }




}

export {createProduct,createCategory,getCategory,getProduct,updateCategory,updateProduct,deleteCategory,deleteProduct}