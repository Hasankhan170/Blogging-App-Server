import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


 
const generateAccessToken = (user)=>{
    return jwt.sign({email:user.email},process.env.ACCESS_TOKEN,{
        expiresIn: '6h' 
    })
}

const generateRefreshToken = (user)=>{
    return jwt.sign({email:user.email},process.env.REFRESH_TOKEN,{
        expiresIn: '7d'
    })
}

// cloudinary img 
const uploadImgToCloudinary = async (filePath) => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    console.log("Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log(process.env.CLOUDINARY_API_KEY);
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          resource_type: "auto",
        });
        fs.unlinkSync(filePath);
        return uploadResult.secure_url;
      } catch (error) {
        fs.unlinkSync(filePath);
        return null;
      }
};

// register
const registerUser = async (req,res)=>{
    const {username,email,password} = req.body;
    if(!username) return res.status(400).json({message: "username is required"});
    if(!email) return res.status(400).json({message: "email is required"});
    if(!password) return res.status(400).json({message: "password is required"});
    if (!req.file) return res.status(400).json({ message: "Image is required" });
    const user = await User.findOne({email: email})
    if(user) return res.status(400).json({message: "email already exists"});

    const imageUrl = await uploadImgToCloudinary(req.file.path);
    const userCreate = await User.create({
        username,
        email,
        password,
        image: imageUrl
    })

    res.status(200).json({
        message : "User created successfully",
        data: userCreate,
    })

}

// login
const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    if(!email) return res.status(400).json({message: "email is required"});
    if(!password) return res.status(400).json({message: "password is required"});

    const user = await User.findOne({email: email})
    if(!user) return res.status(404).json({message: "no user found"});

    const isPassword = await bcrypt.compare(password,user.password);
    if(!isPassword) return res.status(404).json({message: "incorrect password"});

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.cookie("refreshToken",refreshToken, {http:true,secure:false})

    res.status(200).json({
        message: "Logged in successfully",
        accessToken,
        refreshToken,
        data: user

    })
}

// logout
const logoutUser = async (req,res)=>{
    res.clearCookie("refreshToken");
    res.status(200).json({message: "Logged out successfully"})
}

// refreshToken 
const refreshToken = async(req,res)=>{
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!refreshToken) return res.status(401).json({message: "No refresh token found"});
    const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN)
    const user = await User.findOne({email : decoded.email})
    if(!user) return res.status(404).json({message: "Invalid refresh token"});
    const generateToken = generateAccessToken(user)
    res.status(200).json({message: "access token generate",accessToken:generateToken})
    res.json({decoded})
}



export {registerUser,loginUser,logoutUser,refreshToken,}





// upload img
// const uploadImage = async (req,res)=>{
//     if(!req.file) return res.status(403).json({
//         message: "No image found"
//     })

//     const image = req.file.path;
//     console.log("File path:", req.file.path);

//     try {
//         const uploadResult = await uploadImgToCloudinary(image)
//         if(!uploadResult) return res.status(400).json({
//             message: "Failed to upload image"
//         })

//         res.json({
//             message: "Image uploaded successfully",
//             url: uploadResult
//         })
//     } catch (error) { 
//         console.log(error);
//         res.status(500).json({ message: "error occured while uploading image" });
        
//     }
// }