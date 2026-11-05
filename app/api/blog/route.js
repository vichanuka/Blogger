import { ConnectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";
import {writeFile} from "fs/promises";
import BlogModel from "@/lib/models/BlogModels";

export async function GET(request) {
    const LoadDB = async () =>{
        await ConnectDB();
    }

    LoadDB();

    return NextResponse.json({ 
        message: "GET request received" 
    });
}

export async function POST(request) {
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