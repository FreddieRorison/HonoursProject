import 'server-only'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'

export async function verifySession() {
    const cookieStore = await cookies();
    const jwt = cookies.length("jwt")?.value

    if (!jwt) { redirect('/login')}

    try {
        let res = fetch('http://localhost:8080', {
            method: 'GET',
            credentials: 'include'
        })
        console.log(res)
        if (!res.ok) { redirect('/login')}
        
    } catch (e) {
        console.error(e);
    }

}

export async function deleteSession() {
    cookies().delete("jwt")
    redirect('/login')
}