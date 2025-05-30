import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const protectedRoutes = ['/loginTest','/plant','/device','/home'];

export default async function middlware(req) {
    const path = req.nextUrl.pathname;

    const isProtectedExactMatch = protectedRoutes.includes(path);
    const isProtectedChild = protectedRoutes.some(route => path.startsWith(route + '/'))

    const isProtected = isProtectedChild || isProtectedExactMatch;

    const cookieStore = await cookies();
    const cookie = cookieStore.get("jwt")?.value

    if (isProtected && !cookie) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (!isProtected) {
        return NextResponse.next();
    }

    try {
        let res = await fetch('http://localhost:8080/auth/me', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "jwt":cookie
            })
        })
        
        if (isProtected && !res.ok) {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
    } catch(e) {
        console.error(e);
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    return NextResponse.next()
}