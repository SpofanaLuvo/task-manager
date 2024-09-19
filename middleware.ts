import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

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

// Middleware function
export async function middleware(request: NextRequest) {
    console.log("Middleware execution for URL:", request.nextUrl.pathname);
    const url = request.nextUrl.clone();

    // List of protected routes
    const protectedRoutes = ['/api/task', '/api/test'];

    // Check if the request url matches any of the protected routes
    const requiresAuth = protectedRoutes.some(route => url.pathname.startsWith(route));

    if (requiresAuth) {
        const token = request.cookies.get('access-token');
        console.log("Token found:", token);

        if (!token || !(await verifyToken(token))) {
            // Differentiating between API and non-API routes
            if (url.pathname.startsWith('/api/')) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
            } else {
                url.pathname = '/auth/login';
                return NextResponse.redirect(url);
            }
        }
    }

    return NextResponse.next();
}

// Config to specify the paths where the middleware should be applied
export const config = {
    matcher:  ['/api/task/:path*','/api/test/:path*'], // Add more paths if needed
};
