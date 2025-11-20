import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyTokenFromRequest(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieHeader = request.headers.get("cookie") || "";

    let token = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Try cookie `authToken` parsing
    if (!token) {
      const match = cookieHeader.match(/authToken=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    if (!JWT_SECRET) {
      console.error("JWT_SECRET missing");
      return { ok: false, response: NextResponse.json({ error: "Server misconfiguration" }, { status: 500 }) };
    }

    const payload = jwt.verify(token, JWT_SECRET);
    return { ok: true, payload };
  } catch (error) {
    console.error("Token verify error:", error.message);
    return { ok: false, response: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }
}

export function requirePermission(request, permission) {
  const result = verifyTokenFromRequest(request);
  if (!result.ok) return result.response;

  const { payload } = result;
  const permissions = payload.permissions || [];
  if (!permissions.includes(permission)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null; // allowed
}
