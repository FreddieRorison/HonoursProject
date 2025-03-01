'use server'

import { cookies } from "next/headers";
import { LoginFormSchema } from "@/app/_lib/definitions"
import { redirect } from 'next/navigation';

export async function login(state, formData) {
    const validateRes = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    })

    if (!validateRes.success) {
        return {
            errors: validateRes.error.flatten().fieldErrors
        }
    }
    try {

    let res = await fetch('http://localhost:8080/login', {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "email": formData.get('email'),
            "password": formData.get('password')
        })
    })

    const cookieStore = await cookies();
    const jwt = res.headers.get('set-cookie')
    if (jwt.startsWith("jwt=")) {
        cookieStore.set("jwt", jwt.substring(4))
    }

    } catch (e) {
        console.error(e);
    }

    redirect('/home')
}