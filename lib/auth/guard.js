import { verifyToken, COOKIE_NAME } from "./session";
import { NextResponse } from "next/server";

/**
 * Checks whether the incoming request has a valid admin session
 * (via HTTP-only cookie or Bearer authorization header).
 * Returns the admin payload if valid, or null if unauthenticated.
 */
export async function verifyAdminSession(request) {
  let token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return null;
  }

  return payload;
}

/**
 * Standard 401 Unauthorized JSON response helper.
 */
export function unauthorizedResponse(message = "Unauthorized: Admin access required") {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

