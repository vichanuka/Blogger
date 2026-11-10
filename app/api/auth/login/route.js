import { ConnectDB } from "@/lib/config/db";
import AdminModel from "@/lib/models/AdminModel";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { signToken, COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await ConnectDB();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const adminCount = await AdminModel.countDocuments();

    // First-time setup: automatically initialize the primary admin if no admin exists yet
    if (adminCount === 0) {
      const hashedPassword = hashPassword(password);
      const initialAdmin = await AdminModel.create({
        email: cleanEmail,
        password: hashedPassword,
        name: "Admin",
        role: "admin",
      });

      const token = await signToken({
        id: initialAdmin._id.toString(),
        email: initialAdmin.email,
        name: initialAdmin.name,
        role: initialAdmin.role,
      });

      const response = NextResponse.json({
        success: true,
        message: "Admin account initialized successfully",
        admin: { email: initialAdmin.email, name: initialAdmin.name },
      });

      response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
      return response;
    }

    // Normal login flow
    const admin = await AdminModel.findOne({ email: cleanEmail });
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = verifyPassword(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      admin: { email: admin.email, name: admin.name },
    });

    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

