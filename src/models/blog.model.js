import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
},
{
    timestamps: true,
})

export default mongoose.model('blogs', blogSchema)