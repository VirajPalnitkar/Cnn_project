import { User } from "./schemas/User_details.js";
import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';

const app=express();
const PORT=5555;
const MONGO_URL='mongodb://localhost:27017/User_login_details';

app.use(cors());
app.use(express.json());

app.post('/register',async (req,res)=>{
  if(!req.body.userName || !req.body.rollNumber){
    return res.status(400).send({message:"Enter all the details"});
  }
  const userInfo={
    userName:req.body.userName,
    rollNumber:req.body.rollNumber
  };
  try{
    const existingUser=await User.findOne({rollNumber:req.body.rollNumber});
    if(existingUser){
      return res.status(409).json({message:"User with this roll number already exists"});
    }
    const newUser=new User(userInfo);
    await newUser.save();
    res.status(201).json({message:"New user registered successfully"});
  }
  catch(error){
    res.status(500).send({message:"Server error"});
  }

})


app.post('/login',async (req,res)=>{
  if(!req.body.userName || !req.body.rollNumber){
    return res.status(400).send({message:"Enter all the details"});
  }
  try{
    const existingUser=await User.findOne({rollNumber:req.body.rollNumber});
    if(existingUser){
      return res.status(201).json({message:"Exists"});
    }
    else{
      return res.status(400).json({message:"The user does not exist"});
    }
  }
  catch(error){
    res.status(500).send({message:"Server error"});
  }
})

mongoose.connect(MONGO_URL)
.then(()=>{
  console.log("Connected to mongodb ", MONGO_URL);
  app.listen(PORT,()=>{
    console.log("Server started on port",PORT);
  })
})
.catch((error)=>{
  console.log(error);
})
