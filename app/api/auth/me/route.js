import { verifyAdminSession, unauthorizedResponse } from "@/lib/auth/guard";
import { NextResponse } from "next/server";

export async function GET(request) {
  const admin = await verifyAdminSession(request);

  if (!admin) {
    return unauthorizedResponse("Not authenticated");
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  });
}

