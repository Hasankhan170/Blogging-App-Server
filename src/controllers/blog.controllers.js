import mongoose from "mongoose";
import Blogs from "../models/blog.model.js"
import User from "../models/user.model.js"

const createBlog = async (req,res)=>{
    const {title,description, userId} = req.body;

    if(!title) return res.status(400).json({message: "title is required"});
    if(!description) return res.status(400).json({message: "description is required"});

    const user = await User.findById(userId);
    if(!user) return res.status(404).json({message: "user not found"})
    
        const existingBlog = await Blogs.findOne({ title });
        if (existingBlog) {
          return res.status(400).json({ message: "Blog with this title already exists" });
        }
    const blog = await Blogs.create({
        title,
        description,
        author : user._id
    })


    res.status(200).json({
        message : "Blog created successfully",
        data: blog
    })
}

const singleBlog = async (req,res)=>{
    const {userId} = req.params;

    console.log("Received userId:", userId);

    if(!mongoose.Types.ObjectId.isValid(userId)){
        return res.status(400).json({message: "Invalid id"})
    }

    try {
        
        const blog = await Blogs.find({ author: userId });
        if (blog.length === 0) {
          return res.status(404).json({ message: "No blogs found for this user" });
        }
    
        res.status(200).json({
          message: "Blogs retrieved successfully",
          data: blog,
        });
      } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Server error" });
      }
}

const allBlogs = async (req,res)=>{
    const blogs = await Blogs.find({});
    res.status(200).json({
        message : "All blogs",
        data: blogs
    })
}

const deleteBlog = async (req,res)=>{
    const {id} = req.params;
    const blog = await Blogs.findByIdAndDelete(id);
    if(!blog) return res.status(404).json({message: "Blog not found"})

    res.status(200).json({
        message : "Blog deleted successfully",
        data: blog
    })
}

const editBlog = async (req,res)=>{
    const {id} = req.params;
    const {title,description} = req.body;
    const blog = await Blogs.findByIdAndUpdate( {_id:id},{...req.body});
    if(!blog) return res.status(404).json({message: "Blog not found"})
    res.status(200).json({
        message : "Blog updated successfully",
        data: blog
    })


}

export {createBlog,allBlogs ,deleteBlog,editBlog ,singleBlog}