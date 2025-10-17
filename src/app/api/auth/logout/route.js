// File: app/api/auth/logout/route.js - NEW LOGOUT API
import { NextResponse } from "next/server";

export async function POST(request) {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Delete httpOnly cookie
  response.cookies.delete("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}
