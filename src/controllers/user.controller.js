
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"


  const registerUser = async(req,res) =>{
   try {
      
     const {userName,email,fullName,password,role,number,address} = req.body
 
     if(userName == "" && email == "" && fullName == "" && password == "" && role =="" && number == "" && address == ""){
         throw new Error("All fields are required")
     }

    const existedUser =  await User.findOne({
      $or : [
         {userName},
         {email}
      ]
     })

     if(existedUser) {
       throw new Error("Username and Email already exists")
     }
      
    const filePath = req?.file.path

    const avatar = await uploadCloudinary(filePath)

    const user = await User.create({
      userName : userName.toLowerCase(),
      email,
      fullName,
      password,
      role,
      number,
      address,
      avatar : avatar.url
    })

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    if(!createdUser){
      throw new Error("Something Went Wrong while creating User")
    }

    res.status(200).json({
      message : "User Registered Successfully",
      createdUser
    })

  } catch (error) {
    console.error("Error Message",error.message)
    res.status(400).json({
      
      message : error.message
    })
  }




}

const loginUser = async(req,res)=>{
  try {
    const {userName,password} = req.body
    console.log(password)
    if(userName == "" && password == ""){
      throw new Error("All Credentials are required")
    }

    const user= await User.findOne({userName})

    if(!user){
      throw new Error("User does not exist")
    }
   

   const isValid =  await user.isPasswordCorrect(password)
   console.log(isValid)

   if(!isValid){
    throw new Error("Invalid Password")
   }

   const accessToken = await user.generateAccessToken()
   const refreshToken = await user.generateRefreshToken()

  


   user.refreshToken = refreshToken
   user.save({validateBeforeSave:false})

  

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const options = {
    httpOnly : true,
    secure : true
   }

   return res.status(200)
             .cookie("accessToken",accessToken,options)
             .cookie("refreshToken",refreshToken,options)
             .json({
              message : "Login SuccessFully",
              user : loggedInUser
             })
    
  } catch (error) {
    console.error("error message",error.message)
    res.status(400).json({
      message : error.message
    })
    
  }
}

const logout = async(req,res)=>{
  try {
    const userId = req.userId
    if(!userId){
      throw new Error("You need to login first")
    }

    const user = await User.findById(userId)
    if(!user){
      throw new Error("Used Access Token")
    }
    user.refreshToken = ""
    user.save({validateBeforeSave:false})

    const options = {
      httpOnly:true,
      secure : true
    }

    res.status(200)
    .clearCookie("accessToken",options)
    .json({message:"Logout Successfully"})
    
  } catch (error) {
    console.error("Error Message",error.message)
    res.status(401).json({
      message : error.message
    })
    
  }


}

const refreshAccesToken = async(req,res)=>{
  try {
    const incomingRefreshToken = req.cookies.refreshToken
  
    if(!incomingRefreshToken){
      throw new Error("Token not Found")
    }
  
    const decodeToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    if(!decodeToken){
      throw new Error("Expired or Token Used")
    }
  
    const user = await User.findById(decodeToken._id)
    if(!user){
      throw new Error("Invalid Token")
    }
    console.log("IncomingRefreshToken",incomingRefreshToken)
    console.log("Token",user.refreshToken)
  
    if(incomingRefreshToken!==user.refreshToken){
      throw new Error("Token Used or Expired")
    }
  
    const newAccessToken = await user.generateAccessToken()
    const newRefreshToken = await user.generateRefreshToken()

    user.refreshToken = newRefreshToken
    user.save({validateBeforeSave:false})
  
    const options = {
      httpOnly:true,
      secure:true
    }
    res.status(200)
      .cookie("accessToken",newAccessToken,options)
      .cookie("refreshToken",newRefreshToken,options)
      .json({
        message : "Access Token is refreshed"
      })
  } catch (error) {
    res.status(401).json({
      message : error.message || "Invalid Refresh Token"
    })
    
  }
  
}

const updateCurrentpassword = async(req,res)=>{
  try {
    const userId = req.userId
    const {oldPassword,newPassword} = req.body
  
    if(oldPassword == "" && newPassword == ""){
      throw new Error("Passwords are Required")
    }
  
    if(!userId){
      throw new Error("You Need to login First")
    }
    
    const user = await User.findById(userId)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
      throw new Error("Invalid Old Password")
    }
  
    user.password = newPassword
    user.save({validateBeforeSave:false})
  
    return res.status(200).json({
      message : "Password Successfully Updated"
    })
  } catch (error) {
    res.status(401).json({
      message : error.message || "Error in update Current Password Controller"
    })
    
  }


}

export {registerUser,loginUser,logout,refreshAccesToken,updateCurrentpassword}