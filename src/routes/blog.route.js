import express from 'express';
import { createBlog ,allBlogs,deleteBlog,editBlog} from '../controllers/blog.controllers.js';

const router = express.Router();

router.post("/createBlog",createBlog);
router.get("/allBlogs",allBlogs);
router.delete("/deleteBlog/:id",deleteBlog);
router.put("/editBlog/:id",editBlog);



export default router;