import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

// Function to verify JWT token
async function verifyToken(token: string): Promise<boolean> {
  console.log("VERIFYING TOKEN");
  try {
    const SECRET = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, SECRET);
    console.log("Token is valid:", payload);
    return Boolean(payload);
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const protectedRoutes = ["/api/task", "/api/test"];

  const requiresAuth = protectedRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  if (requiresAuth) {
    // Extract token from the Authorization header
    const authorizationHeader = request.headers.get("Authorization");
    const token = authorizationHeader && authorizationHeader.startsWith("Bearer ")
      ? authorizationHeader.split(" ")[1]
      : null;

    console.log("Authorization Header:", authorizationHeader);
    console.log("Token found:", token);

    if (!token || !(await verifyToken(token))) {
      if (url.pathname.startsWith("/api/")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      } else {
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/task/:path*",
    "/api/auth/refresh:path*",
  ],
};
