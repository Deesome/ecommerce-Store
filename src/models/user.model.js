import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    userName : {
        type :String,
        required : true,
        lowercase : true,
        trim : true,
        unique : true
    },
    email : {
        type :String,
        required : true,
        lowercase : true,
        trim : true,
        unique : true

    },
    fullName : {
        type : String,
        required : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : true,
        
    },
    avatar : {
        type : String,
        default : ""
    },
    role : {
        type : String,
        enums : ["user","role"],
        required : true
    },
    number : {
        type : Number,
        required : true
    },
    address : {
        type : String,
        required : true,
    },
    refreshToken : {
        type : String,
        default : ""
    }

})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()

})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
        _id : this._id,
        userName : this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
        _id : this._id,
        userName : this.userName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

export const User = mongoose.model("User",userSchema)