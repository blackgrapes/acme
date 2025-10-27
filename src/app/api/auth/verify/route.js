// app/api/auth/verify/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import { User } from "@/lib/db";

export async function GET(request) {
  try {
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    const user = await User.findById(decoded.userId).populate("role");

    if (!user || user.status !== "Active") {
      const response = NextResponse.json(
        { error: "Invalid user" },
        { status: 401 }
      );
      response.cookies.delete("authToken");
      return response;
    }

    const userData = {
      userId: user._id,
      email: user.email,
      role: user.role.name,
      permissions: user.role.permissions || [],
      name: user.name,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Verify error:", error);
    const response = NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
    response.cookies.delete("authToken");
    return response;
  }
}
