import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { User } from "@/lib/db"; // Import User model

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";

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

// Get current user from request
export async function getCurrentUser(request) {
  try {
    const result = verifyTokenFromRequest(request);
    if (!result.ok) {
      return null;
    }

    const { payload } = result;
    
    // Extract user ID from payload
    const userId = payload.userId || payload.id;
    if (!userId) {
      return null;
    }

    // Get user from database
    const user = await User.findById(userId)
      .select("-password")
      .populate("role", "name permissions");
    
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Helper function to get user ID from token (for quick access)
export function getUserIdFromRequest(request) {
  try {
    const result = verifyTokenFromRequest(request);
    if (!result.ok) {
      return null;
    }
    
    const { payload } = result;
    return payload.userId || payload.id;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}

// Check if user has specific role
export function hasRole(user, roleName) {
  if (!user || !user.role) return false;
  return user.role.name === roleName;
}

// Check if user has any of the given roles
export function hasAnyRole(user, roleNames) {
  if (!user || !user.role) return false;
  return roleNames.includes(user.role.name);
}

// Get user permissions
export function getUserPermissions(user) {
  if (!user || !user.role) return [];
  return user.role.permissions || [];
}