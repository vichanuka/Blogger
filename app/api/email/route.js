import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { verifyAdminSession, unauthorizedResponse } from "@/lib/auth/guard";

// Public endpoint: readers subscribing to newsletter
export async function POST(request) {
    await ConnectDB();
    const formData = await request.formData();
    const email = `${formData.get('email') || ''}`.toLowerCase().trim();

    if (!email || !email.includes('@')) {
        return NextResponse.json(
            { success: false, message: "Please enter a valid email address" },
            { status: 400 }
        );
    }

    const existing = await EmailModel.findOne({ email });
    if (existing) {
        return NextResponse.json(
            { success: false, message: "This email is already subscribed" },
            { status: 400 }
        );
    }

    await EmailModel.create({ email });
    return NextResponse.json({
        success: true,
        message: "Subscribed successfully",
    });
}

// Protected endpoint: view subscriber list (Admin only)
export async function GET(request) {
    const admin = await verifyAdminSession(request);
    if (!admin) {
        return unauthorizedResponse("Admin authentication required to view subscribers");
    }

    await ConnectDB();
    const emails = await EmailModel.find({}).sort({ date: -1 });
    return NextResponse.json({ emails });
} 

// Protected endpoint: delete subscriber (Admin only)
export async function DELETE(request) {
    const admin = await verifyAdminSession(request);
    if (!admin) {
        return unauthorizedResponse("Admin authentication required to delete subscriptions");
    }

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
