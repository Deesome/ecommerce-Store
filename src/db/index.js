import mongoose from "mongoose"
import { database } from "../constant.js"


async function connectDB(){
    try {
        
        const response = await mongoose.connect(`${process.env.MONGODB_URI}/${database}`)
        console.log("MONGODB CONNECTION SUCCESSFULL || HOST : ",response.connection.host)
        
    } catch (error) {
        console.log("Mongodb Connection Error",error)
        
    }
}

export default connectDB