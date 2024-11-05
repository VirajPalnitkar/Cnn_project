import mongoose from "mongoose";

const userSchema=mongoose.Schema(
    {
        userName:{
            type:String,
            required:true
        },
        rollNumber:{
            type:String,
            required:true
        }

    }
)

export const User=mongoose.model('User',userSchema);