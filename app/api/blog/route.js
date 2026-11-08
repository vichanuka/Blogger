import { ConnectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";
import {writeFile} from "fs/promises";
import BlogModel from "@/lib/models/BlogModels";

const LoadDB = async () =>{
        await ConnectDB();
    }
    LoadDB();
    //API endpoint for fetching blogs
export async function GET(request) {
    await ConnectDB();
    const blogId = request.nextUrl.searchParams.get('id');
    if (blogId) {
        try {
            const blog = await BlogModel.findById(blogId);
            if (!blog) {
                return NextResponse.json({ error: "Blog not found" }, { status: 404 });
            }
            return NextResponse.json(blog);
        } catch (error) {
            return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
        }
    }
    const blogs = await BlogModel.find({});

    return NextResponse.json({ blogs});
}
//API endpoint for uploading blocks
export async function POST(request) {
    await ConnectDB();
    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get('image');
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `public/${timestamp}_${image.name}`;

    await writeFile(path, buffer);
    const imgUrl = `/${timestamp}_${image.name}`;
    
    const blogData = {
        title: `${formData.get('title')}`,
        description: `${formData.get('description')}`,
        category:`${formData.get('category')}`,
        author: `${formData.get('author')}`,
        image: `${imgUrl}`,
        authorImg: `${formData.get('author_img')}`,
    }
    await BlogModel.create(blogData);
    console.log("Blog data saved successfully:");

    return NextResponse.json({
        success: true,
        message: "Blog data saved successfully",
    });
}
