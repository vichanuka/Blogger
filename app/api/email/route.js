import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
    await ConnectDB();
    const formData = await request.formData();
    const emailData = {
        email: `${formData.get('email')}`,
    }
    await EmailModel.create(emailData);
    return NextResponse.json({
        success: true,
        message: "Email saved successfully",
    });
}

export async function GET(request) {
    await ConnectDB();
    const emails = await EmailModel.find({});
    return NextResponse.json({ emails });
} 

export async function DELETE(request) {
    await ConnectDB();
    const id = request.nextUrl.searchParams.get('id');

    if (!id || !mongoose.isValidObjectId(id)) {
        return NextResponse.json({ success: false, message: "A valid email ID is required" }, { status: 400 });
    }

    const deletedEmail = await EmailModel.findByIdAndDelete(id);
    if (!deletedEmail) {
        return NextResponse.json({ success: false, message: "Email subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Email deleted" });
}