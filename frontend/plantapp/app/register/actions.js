'use server'

import { RegisterFormSchema } from "@/app/_lib/definitions"
import { redirect } from 'next/navigation';

export async function register(Firstname, Email, Password) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const validateRes = RegisterFormSchema.safeParse({
        firstname: Firstname,
        email: Email,
        password: Password
    })

    if (!validateRes.success) {
        return false;
    }

    const registerUser = async () => {
        const response = await fetch(apiUrl + '/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstname: Firstname,
            email: Email,
            password: Password
        })
        })
        return await response;
    }

    await registerUser();

    redirect("/login")
}