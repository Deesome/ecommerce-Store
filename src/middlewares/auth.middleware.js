import jwt from "jsonwebtoken"

const verifyToken = async function(req,res,next){
   try {
     const token = req.cookies.accessToken
    
 
     if(!token){
         throw new Error("Token is not Found")
     }
     const decode = jwt.decode(token,process.env.ACCESS_TOKEN_SECRET)
     req.userId = decode._id
     next()
   } catch (error) {
    console.error("Error message",error.message)
    res.status(400).json({
      message : error.message
    })
    
    
   }
    
}

export {verifyToken}