// middleware.js - FIXED FLEXIBLE CHECK WITH PERMISSIONS
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const protectedRoutes = {
  admin: /^\/admin-dashboard(\/.*)?$/,
  client: /^\/client-dashboard(\/.*)?$/,
};

export async function middleware(request) {
  console.log("MIDDLEWARE RUNNING FOR:", request.nextUrl.pathname); // Added for debugging

  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value;

  console.log(`🔍 MIDDLEWARE DEBUG:`);
  console.log(`   Path: ${pathname}`);
  console.log(`   Token exists: ${!!token}`);
  console.log(`   All cookies:`, request.cookies.getAll());

  // Check if it's a protected route
  const isAdminRoute = protectedRoutes.admin.test(pathname);
  const isClientRoute = protectedRoutes.client.test(pathname);

  if (!isAdminRoute && !isClientRoute) {
    console.log("✅ Public route - allowing access");
    return NextResponse.next();
  }

  console.log("🔒 Protected route detected");

  if (!token) {
    console.log("❌ No token found - redirecting to login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Valid token - Permissions:", decoded.permissions);

    const { permissions } = decoded;

    // Role-based access control - FIXED: Use permissions instead of role name
    if (isAdminRoute && !permissions.includes("dashboard-read")) {
      console.log("🚫 Access denied: No admin permissions for admin route");
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("authToken");
      return response;
    }

    if (isClientRoute && !permissions.includes("client-dashboard-read")) {
      console.log("🚫 Access denied: No client permissions for client route");
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("authToken");
      return response;
    }

    console.log("✅ Access granted to protected route");
    return NextResponse.next();
  } catch (error) {
    console.log("❌ Token invalid:", error.message);
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("authToken");
    return response;
  }
}

export const config = {
  matcher: ["/admin-dashboard/:path*", "/client-dashboard/:path*"],
};
