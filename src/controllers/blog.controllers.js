import Blogs from "../models/blog.model.js"
import User from "../models/user.model.js"

const createBlog = async (req,res)=>{
    const {title,description, userId} = req.body;

    if(!title) return res.status(400).json({message: "title is required"});
    if(!description) return res.status(400).json({message: "description is required"});

    const user = await User.findById(userId);
    if(!user) return res.status(404).json({message: "user not found"})

    const blog = await Blogs.create({
        title,
        description,
        author : user._id
    })

    // await blog.save();

    res.status(200).json({
        message : "Blog created successfully",
        data: blog
    })
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
}

export {createBlog,allBlogs ,deleteBlog}