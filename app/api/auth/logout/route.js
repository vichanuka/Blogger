import { COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.set(COOKIE_NAME, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });

  return response;
}

